#!/usr/bin/env node

import { readdirSync, statSync } from "fs";
import { join } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { validateAll } from "@narada.usc/core/src/validator.js";
import { initRepo, createCycle, plan } from "@narada.usc/compiler/src/index.js";
import { refineIntent } from "@narada.usc/compiler/src/refine-intent.js";
import { writeFileSync, existsSync, mkdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..", "..", "..");

function parseArgs(argv) {
  const args = {};
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--") continue;
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

    case "init": {
      const target = positional[1];
      const name = args.name;
      if (!target || !name) {
        die("Usage: usc init <path> --name <name> --principal <name> --intent <text> [--cis] [--git] [--force]");
      }
      const targetDir = initRepo({
        name,
        target,
        principal: args.principal || "TBD",
        intent: args.intent || "TBD",
        useCis: args.cis === true || args.cis === "true",
        initGit: args.git === true || args.git === "true",
        force: args.force === true || args.force === "true",
        rootDir,
      });
      console.log(`USC repo '${name}' initialized at ${targetDir}`);
      if (args.cis) console.log("CIS admissibility policy included.");
      if (args.git) console.log("Git repository initialized.");
      break;
    }

    case "cycle": {
      const intent = args.intent;
      if (!intent) die("Usage: usc cycle --intent <text> [--target <path>] [--name <cycle-name>] [--force]");
      const target = args.target || process.cwd();
      const cycleDir = createCycle({
        target,
        name: args.name || null,
        intent,
        force: args.force === true || args.force === "true",
      });
      console.log(`Cycle opened at ${cycleDir}`);
      break;
    }

    case "plan": {
      const target = args.target;
      if (!target) die("Usage: usc plan --target <path> [--from <refinement-file>] [--force]");
      const result = plan({
        target,
        from: args.from || null,
        force: args.force === true || args.force === "true",
      });
      console.log(`Task graph written to ${result.taskGraphPath}`);
      console.log(`Tasks: ${result.summary.task_count}, Runnable: ${result.summary.runnable_count}, Blocked: ${result.summary.blocked_count}`);
      break;
    }

    case "refine": {
      const intent = args.intent;
      if (!intent) die("Usage: usc refine --intent <text> [--target <path>] [--domain <domain>] [--cis] [--format json|md] [--force]");
      const domain = args.domain || null;
      const format = args.format || "md";
      const target = args.target;
      const useCis = args.cis === true || args.cis === "true";
      const force = args.force === true || args.force === "true";

      const refinement = await refineIntent(intent, domain);

      if (format === "json") {
        console.log(JSON.stringify(refinement, null, 2));
      } else {
        console.log(`# Intent Refinement: ${intent}\n`);
        console.log(`**Detected Domain:** ${refinement.detected_domain}\n`);
        console.log("## Ambiguities\n");
        for (const a of refinement.ambiguities) {
          console.log(`- **${a.layer}**: ${a.description}${a.governing ? " (governing)" : ""}`);
        }
        console.log("\n## Questions\n");
        for (const q of refinement.questions) {
          console.log(`- **${q.authority}**: ${q.question}${q.blocking ? " (blocking)" : ""}`);
        }
        console.log("\n## Assumptions\n");
        for (const a of refinement.assumptions) {
          console.log(`- ${a.assumption} (confidence: ${a.confidence})`);
        }
        console.log("\n## Seed Tasks\n");
        for (const t of refinement.seed_tasks) {
          console.log(`- **${t.id}**: ${t.title}`);
        }
        console.log("\n## Residuals\n");
        for (const r of refinement.residuals) {
          console.log(`- **${r.residual_id}**: ${r.description} (${r.blocking ? "blocking" : "non-blocking"})`);
        }
      }

      if (target) {
        const targetDir = target.startsWith("/") ? target : join(process.cwd(), target);
        const uscDir = join(targetDir, "usc");

        const refinementPath = join(uscDir, "refinement.json");
        const refinementMdPath = join(uscDir, "refinement.md");

        const existingFiles = [];
        if (existsSync(refinementPath)) existingFiles.push(refinementPath);
        if (existsSync(refinementMdPath)) existingFiles.push(refinementMdPath);

        if (existingFiles.length > 0 && !force) {
          die(`Refuse to overwrite existing refinement artifact(s): ${existingFiles.join(", ")}\nUse --force to overwrite.`);
        }

        if (!existsSync(uscDir)) {
          mkdirSync(uscDir, { recursive: true });
        }

        writeFileSync(refinementPath, JSON.stringify(refinement, null, 2));
        console.log(`\nRefinement written to ${refinementPath}`);

        const mdContent = [`# Intent Refinement: ${intent}`, ``, `**Detected Domain:** ${refinement.detected_domain}`, ``, `## Ambiguities`, ...refinement.ambiguities.map(a => `- **${a.layer}**: ${a.description}${a.governing ? " (governing)" : ""}`), ``, `## Questions`, ...refinement.questions.map(q => `- **${q.authority}**: ${q.question}${q.blocking ? " (blocking)" : ""}`), ``, `## Assumptions`, ...refinement.assumptions.map(a => `- ${a.assumption} (confidence: ${a.confidence})`), ``, `## Seed Tasks`, ...refinement.seed_tasks.map(t => `- **${t.id}**: ${t.title} — ${t.transformation}`), ``, `## Residuals`, ...refinement.residuals.map(r => `- **${r.residual_id}**: ${r.description} (${r.blocking ? "blocking" : "non-blocking"})`), ``].join("\n");
        writeFileSync(refinementMdPath, mdContent);
        console.log(`Refinement markdown written to ${refinementMdPath}`);
      }
      break;
    }

    default:
      console.log(`Usage: usc <command> [options]

Commands:
  validate                          Validate examples and USC repos
  validate --app <path>             Validate an external USC repo
  init <path> --name <name>         Initialize a USC-governed construction repo
  cycle --intent <text>             Open a construction cycle/checkpoint in an existing repo
  plan --target <path>              Convert refinement into task graph
  refine --intent <text>            Refine raw intent into ambiguity, questions, tasks

USC is a compiler and artifact generator, not an operator.
Task claiming, execution, completion, and lifecycle governance belong in Narada proper.
`);
      process.exit(1);
  }
}

run();
