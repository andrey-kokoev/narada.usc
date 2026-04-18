import { readFileSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(__dirname, "..");

function renderTemplate(content, vars) {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}

function createSession({ name, principal, intent, useCis, force, rootDir }) {
  const sessionDir = join(rootDir, "sessions", name);
  if (existsSync(sessionDir) && !force) {
    throw new Error(`Session '${name}' already exists. Use --force to overwrite.`);
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

  const templatesDir = join(pkgDir, "templates");
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

  const schemaPrefix = "../../packages/core/schemas";

  const taskGraph = {
    $schema: `${schemaPrefix}/task-graph.schema.json`,
    tasks: [
      {
        id: "T1",
        title: `Initial task for ${name}`,
        authority_locus: "principal",
        transformation: "Define the first executable transformation for this session.",
        evidence_requirement: "Artifacts exist and demonstrate the transformation.",
        review_predicate: "A reviewer can verify the transformation from the evidence alone.",
        status: "open",
      },
    ],
    edges: [],
  };
  writeFileSync(join(sessionDir, "task-graph.json"), JSON.stringify(taskGraph, null, 2));

  const constructionState = {
    $schema: `${schemaPrefix}/construction-state.schema.json`,
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
    const cisPolicy = JSON.parse(
      readFileSync(join(rootDir, "packages", "policies", "examples", "cis-required.json"), "utf8")
    );
    delete cisPolicy.$schema;
    constructionState.admissibility_policies = [cisPolicy];
  }

  writeFileSync(join(sessionDir, "construction-state.json"), JSON.stringify(constructionState, null, 2));

  return sessionDir;
}

export { createSession };
