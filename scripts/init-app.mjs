import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

function parseArgs(argv) {
  const args = {};
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
    }
  }
  return args;
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function renderTemplate(content, vars) {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));

const name = args.name;
const target = args.target;
if (!name) die("Usage: pnpm usc:init-app -- --name <app-name> --target <path> [--principal <name>] [--intent <text>] [--cis] [--git] [--force]");
if (!target) die("Usage: pnpm usc:init-app -- --name <app-name> --target <path> [--principal <name>] [--intent <text>] [--cis] [--git] [--force]");

const principal = args.principal || "TBD";
const intent = args.intent || "TBD";
const useCis = args.cis === true || args.cis === "true";
const initGit = args.git === true || args.git === "true";
const force = args.force === true || args.force === "true";

const targetDir = target.startsWith("/") ? target : join(process.cwd(), target);

if (existsSync(targetDir)) {
  let hasContent = false;
  try {
    const entries = readdirSync(targetDir);
    if (entries.length > 0) hasContent = true;
  } catch {
    // ignore
  }
  if (hasContent && !force) {
    die(`Target '${targetDir}' already exists and is not empty. Use --force to overwrite.`);
  }
}

mkdirSync(targetDir, { recursive: true });

const uscDir = join(targetDir, "usc");
mkdirSync(uscDir, { recursive: true });
mkdirSync(join(uscDir, "reviews"), { recursive: true });
mkdirSync(join(uscDir, "residuals"), { recursive: true });
mkdirSync(join(uscDir, "closures"), { recursive: true });

if (useCis) {
  mkdirSync(join(uscDir, "policies"), { recursive: true });
}

const timestamp = new Date().toISOString();
const vars = {
  NAME: name,
  PRINCIPAL: principal,
  INTENT: intent,
  TIMESTAMP: timestamp,
  DATE: timestamp.slice(0, 10),
  TARGET: targetDir,
  CIS_NOTE: useCis
    ? "\n> This app is governed by a required CIS admissibility policy. All construction steps must preserve functional properties and transformation potential."
    : "",
};

// Generate README.md
const readmeContent = `# narada.usc.${name}

A concrete system constructed under USC discipline.

## Structure

| Path | Purpose |
|------|---------|
| \`usc/\` | USC construction state, tasks, reviews, residuals, closures |
| \`usc/construction-state.json\` | Durable construction state |
| \`usc/task-graph.json\` | Task and dependency graph |
| product code | Lives outside \`usc/\`; specific to this app |

## USC Substrate

Reusable USC grammar, protocols, and templates live in the substrate repo:

\`\`\`text
narada.usc
\`\`\`

This app repo contains app-specific construction work and product code.

## Quick Start

1. Edit \`usc/construction-state.json\` to reflect current intent and state.
2. Use templates in \`usc/\` to create tasks, reviews, and closures.
3. Validate from the substrate repo:
   \`\`\`bash
   cd /path/to/narada.usc
   pnpm validate -- --app ${targetDir}
   \`\`\`

${vars.CIS_NOTE}
`;

writeFileSync(join(targetDir, "README.md"), readmeContent.trim() + "\n");

// Generate AGENTS.md
const agentsContent = `# AGENTS.md — narada.usc.${name}

This is a concrete USC app repo. Use \`usc/\` artifacts for construction discipline.

## Rules

- Do not create derivative status files such as \`*-EXECUTED.md\`, \`*-RESULT.md\`, or \`*-DONE.md\`.
- Preserve authority, evidence, review, and residual distinctions.
- Do not place private secrets, credentials, or operational traces in public artifacts.
- Update canonical artifacts directly when work is complete.

## Construction State

The durable construction state lives in \`usc/construction-state.json\`.
Task and dependency graph lives in \`usc/task-graph.json\`.

## Validation

From the substrate repo:

\`\`\`bash
cd /path/to/narada.usc
pnpm validate -- --app ${targetDir}
\`\`\`
`;

writeFileSync(join(targetDir, "AGENTS.md"), agentsContent.trim() + "\n");

// Copy templates
const templatesDir = join(rootDir, "templates");
const templateFiles = [
  "construction-session.md",
  "decision-surface.md",
  "task.md",
  "review.md",
  "residual.md",
  "closure-record.md",
];

for (const file of templateFiles) {
  const src = join(templatesDir, file);
  if (!existsSync(src)) continue;
  const content = readFileSync(src, "utf8");
  const rendered = renderTemplate(content, vars);
  writeFileSync(join(uscDir, file), rendered);
}

// Generate task-graph.json
const taskGraph = {
  $schema: "../../schemas/task-graph.schema.json",
  tasks: [
    {
      id: "T1",
      title: `Initial task for ${name}`,
      authority_locus: "principal",
      transformation: "Define the first executable transformation for this app.",
      evidence_requirement: "Artifacts exist and demonstrate the transformation.",
      review_predicate: "A reviewer can verify the transformation from the evidence alone.",
      status: "open",
    },
  ],
  edges: [],
};
writeFileSync(join(uscDir, "task-graph.json"), JSON.stringify(taskGraph, null, 2));

// Generate construction-state.json
const constructionState = {
  $schema: "../../schemas/construction-state.schema.json",
  system: {
    name: name,
    version: "0.0.0",
  },
  intent: {
    principal: principal,
    statement: intent,
  },
  decision_context: {
    matters: [],
  },
  arbitrariness: [],
  closure: [],
  task_graph: taskGraph,
  evidence: [],
  review_predicates: [],
};

if (useCis) {
  const cisPolicy = JSON.parse(readFileSync(join(rootDir, "examples", "policies", "cis-required.json"), "utf8"));
  delete cisPolicy.$schema;
  constructionState.admissibility_policies = [cisPolicy];
  writeFileSync(join(uscDir, "policies", "cis-required.json"), JSON.stringify(cisPolicy, null, 2));
}

writeFileSync(join(uscDir, "construction-state.json"), JSON.stringify(constructionState, null, 2));

// Optionally init git
if (initGit) {
  try {
    execSync("git init", { cwd: targetDir, stdio: "ignore" });
    console.log(`Git initialized in ${targetDir}`);
  } catch {
    console.error(`Warning: failed to initialize git in ${targetDir}`);
  }
}

console.log(`App repo '${name}' created at ${targetDir}`);
if (useCis) console.log("CIS admissibility policy included.");
if (initGit) console.log("Git repository initialized.");
