import { readFileSync, existsSync, mkdirSync, copyFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

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

function renderTemplate(content, vars) {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}

const { args } = parseArgs(process.argv.slice(2));

const name = args.name;
if (!name) die("Usage: pnpm usc:init -- --name <session-name> [--principal <name>] [--intent <text>] [--cis] [--force]");

const principal = args.principal || "TBD";
const intent = args.intent || "TBD";
const useCis = args.cis === true || args.cis === "true";
const force = args.force === true || args.force === "true";

const sessionDir = join(rootDir, "sessions", name);
if (existsSync(sessionDir) && !force) {
  die(`Session '${name}' already exists. Use --force to overwrite.`);
}

mkdirSync(sessionDir, { recursive: true });
mkdirSync(join(sessionDir, "reviews"), { recursive: true });
mkdirSync(join(sessionDir, "residuals"), { recursive: true });
mkdirSync(join(sessionDir, "closures"), { recursive: true });

const timestamp = new Date().toISOString();
const vars = {
  NAME: name,
  PRINCIPAL: principal,
  INTENT: intent,
  TIMESTAMP: timestamp,
  DATE: timestamp.slice(0, 10),
  CIS_NOTE: useCis
    ? "\n> This session is governed by a required CIS admissibility policy. All construction steps must preserve functional properties and transformation potential."
    : "",
};

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
  writeFileSync(join(sessionDir, file), rendered);
}

// Generate starter task-graph.json
const taskGraph = {
  $schema: "../../schemas/task-graph.schema.json",
  tasks: [
    {
      id: "T1",
      title: "Initial task for {{NAME}}",
      authority_locus: "principal",
      transformation: "Define the first executable transformation for this session.",
      evidence_requirement: "Artifacts exist and demonstrate the transformation.",
      review_predicate: "A reviewer can verify the transformation from the evidence alone.",
      status: "open",
    },
  ],
  edges: [],
};
writeFileSync(join(sessionDir, "task-graph.json"), JSON.stringify(taskGraph, null, 2).replace(/{{NAME}}/g, name));

// Generate starter construction-state.json
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
}

writeFileSync(join(sessionDir, "construction-state.json"), JSON.stringify(constructionState, null, 2));

console.log(`Session '${name}' created at ${sessionDir}`);
if (useCis) console.log("CIS admissibility policy included.");
