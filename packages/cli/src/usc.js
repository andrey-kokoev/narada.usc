#!/usr/bin/env node

import { readdirSync, statSync } from "fs";
import { join } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { validateAll } from "@narada.usc/core/src/validator.js";
import { createSession, createApp } from "@narada.usc/compiler/src/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..", "..", "..");

function parseArgs(argv) {
  const args = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { args, positional };
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}

const { args, positional } = parseArgs(process.argv.slice(2));
const command = positional[0];

async function run() {
  switch (command) {
    case "validate": {
      const { results, allPassed } = validateAll({ rootDir, appPath: args.app });
      for (const result of results) {
        if (result.valid) {
          console.log(`PASS ${result.name}`);
        } else {
          console.error(`FAIL ${result.name}`);
          for (const err of result.errors) {
            console.error(`  ${err}`);
          }
        }
      }
      if (!allPassed) {
        process.exit(1);
      }
      console.log("\nAll validations passed.");
      break;
    }

    case "init-session": {
      const name = args.name;
      if (!name) die("Usage: usc init-session --name <session-name> [--principal <name>] [--intent <text>] [--cis] [--force]");
      const sessionDir = createSession({
        name,
        principal: args.principal || "TBD",
        intent: args.intent || "TBD",
        useCis: args.cis === true || args.cis === "true",
        force: args.force === true || args.force === "true",
        rootDir,
      });
      console.log(`Session '${name}' created at ${sessionDir}`);
      if (args.cis) console.log("CIS admissibility policy included.");
      break;
    }

    case "list-sessions": {
      const sessionsDir = join(rootDir, "sessions");
      let sessions = [];
      try {
        sessions = readdirSync(sessionsDir).filter((name) => {
          const path = join(sessionsDir, name);
          try {
            return statSync(path).isDirectory();
          } catch {
            return false;
          }
        });
      } catch {
        // ignore
      }
      if (sessions.length === 0) {
        console.log("No sessions found.");
        break;
      }
      for (const name of sessions) {
        console.log(`- ${name}`);
      }
      break;
    }

    case "init-app": {
      const name = args.name;
      const target = args.target;
      if (!name || !target) {
        die("Usage: usc init-app --name <app-name> --target <path> [--principal <name>] [--intent <text>] [--cis] [--git] [--force]");
      }
      const targetDir = createApp({
        name,
        target,
        principal: args.principal || "TBD",
        intent: args.intent || "TBD",
        useCis: args.cis === true || args.cis === "true",
        initGit: args.git === true || args.git === "true",
        force: args.force === true || args.force === "true",
        rootDir,
      });
      console.log(`App repo '${name}' created at ${targetDir}`);
      if (args.cis) console.log("CIS admissibility policy included.");
      if (args.git) console.log("Git repository initialized.");
      break;
    }

    default:
      console.log(`Usage: usc <command> [options]

Commands:
  validate                          Validate examples and sessions
  validate --app <path>             Validate an external app repo
  init-session --name <name>        Create a new session
  list-sessions                     List existing sessions
  init-app --name <name> --target <path>  Create a new app repo
`);
      process.exit(1);
  }
}

run();
