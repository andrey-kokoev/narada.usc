#!/usr/bin/env node

import { readdirSync, statSync } from "fs";
import { join } from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { validateAll } from "@narada.usc/core/src/validator.js";
import { initRepo, createCycle, plan, nextTask, completeTask, rejectTask, blockTask, executeTask, runLoop } from "@narada.usc/compiler/src/index.js";
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

    case "next": {
      const target = args.target;
      if (!target) die("Usage: usc next --target <path> [--claimant <id>] [--format json|md]");
      const result = nextTask({ target, claimant: args.claimant || null });
      if (args.format === "json") {
        console.log(JSON.stringify(result, null, 2));
      } else {
        if (result.task) {
          console.log(`Claimed task ${result.task.id}: ${result.task.title}`);
        } else {
          console.log("No runnable tasks available.");
        }
      }
      break;
    }

    case "complete": {
      const target = args.target;
      const taskId = args.task;
      const resultFile = args.result;
      if (!target || !taskId || !resultFile) {
        die("Usage: usc complete --target <path> --task <id> --result <file> --reviewer <id> [--claimant <id>] [--format json|md]");
      }
      const result = completeTask({ target, taskId, resultFile, claimant: args.claimant || null, reviewer: args.reviewer || null });
      if (args.format === "json") {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`Completed task ${result.task.id}: ${result.task.title}`);
      }
      break;
    }

    case "reject": {
      const target = args.target;
      const taskId = args.task;
      const reason = args.reason;
      if (!target || !taskId || !reason) {
        die("Usage: usc reject --target <path> --task <id> --reason <text> [--reviewer <id>] [--format json|md]");
      }
      const result = rejectTask({ target, taskId, reason, reviewer: args.reviewer || null });
      if (args.format === "json") {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`Rejected task ${result.task.id}: ${result.task.title}`);
      }
      break;
    }

    case "block": {
      const target = args.target;
      const taskId = args.task;
      const reason = args.reason;
      const until = args.until;
      if (!target || !taskId || !reason || !until) {
        die("Usage: usc block --target <path> --task <id> --reason <text> --until <text> [--format json|md]");
      }
      const result = blockTask({ target, taskId, reason, until });
      if (args.format === "json") {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`Blocked task ${result.task.id}: ${result.task.title}`);
      }
      break;
    }

    case "loop": {
      const target = args.target;
      const executor = args.executor;
      if (!target || !executor) {
        die("Usage: usc loop --target <path> --executor <name> [--max-steps <n>] [--dry-run] [--format json|md]");
      }
      const maxSteps = args["max-steps"] ? parseInt(args["max-steps"], 10) : undefined;
      const result = await runLoop({
        target,
        executorName: executor,
        maxSteps,
        dryRun: args["dry-run"] === true || args["dry-run"] === "true",
      });
      if (args.format === "json") {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`Loop completed: ${result.totalSteps} step(s)`);
        for (const step of result.steps) {
          if (step.action === "stop") {
            console.log(`  Step ${step.step}: stopped — ${step.reason}`);
          } else if (step.action === "execute_error") {
            console.log(`  Step ${step.step}: error on ${step.task} — ${step.error}`);
          } else {
            console.log(`  Step ${step.step}: ${step.task} — ${step.title} (${step.executor})`);
            if (step.dryRun) console.log(`    [DRY RUN]`);
            if (step.artifactPath) console.log(`    Artifact: ${step.artifactPath}`);
          }
        }
      }
      break;
    }

    case "execute": {
      const target = args.target;
      const taskId = args.task;
      const executor = args.executor;
      if (!target || !taskId || !executor) {
        die("Usage: usc execute --target <path> --task <id> --executor <name> [--dry-run] [--format json|md]");
      }
      const result = await executeTask({
        target,
        taskId,
        executorName: executor,
        dryRun: args["dry-run"] === true || args["dry-run"] === "true",
      });
      if (args.format === "json") {
        console.log(JSON.stringify(result, null, 2));
      } else {
        if (result.dryRun) {
          console.log(`[DRY RUN] Would execute task ${result.task.id} (${result.task.title}) with executor '${result.executor}'`);
        } else {
          console.log(`Executed task ${result.task.id} (${result.task.title}) with executor '${result.executor}'`);
          if (result.result && result.result.artifactPath) {
            console.log(`Artifact: ${result.result.artifactPath}`);
          }
          if (result.result && result.result.stdout) {
            console.log(result.result.stdout);
          }
        }
      }
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
  cycle --intent <text>             Open a construction cycle in an existing repo
  plan --target <path>              Convert refinement into task graph
  next --target <path>              Claim the first runnable task
  complete --target <path>          Complete a claimed task
  reject --target <path>            Reject a task with reason
  block --target <path>             Block a task with reason and unblock condition
  execute --target <path>           Execute a claimed task via an executor adapter
  loop --target <path>              Bounded constructor loop (next -> execute)
  refine --intent <text>            Refine raw intent into ambiguity, questions, tasks
  refine --target refuses to overwrite existing refinement artifacts unless --force is provided.
`);
      process.exit(1);
  }
}

run();
