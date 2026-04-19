import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(__dirname, "..");

function renderTemplate(content, vars) {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}

function initRepo({ name, target, principal, intent, useCis, initGit, force, rootDir }) {
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
      throw new Error(`Target '${targetDir}' already exists and is not empty. Use --force to overwrite.`);
    }
  }

  mkdirSync(targetDir, { recursive: true });

  const uscDir = join(targetDir, "usc");
  mkdirSync(uscDir, { recursive: true });
  mkdirSync(join(uscDir, "reviews"), { recursive: true });
  mkdirSync(join(uscDir, "residuals"), { recursive: true });
  mkdirSync(join(uscDir, "closures"), { recursive: true });
  mkdirSync(join(uscDir, "cycles"), { recursive: true });

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

  const readmeContent = `# narada.usc.${name}

A USC-governed construction repo.

## Structure

| Path | Purpose |
|------|---------|
| \`usc/\` | USC construction state, tasks, reviews, residuals, closures, cycles |
| \`usc/construction-state.json\` | Durable construction state |
| \`usc/task-graph.json\` | Task and dependency graph |
| \`usc/cycles/\` | Construction cycles and checkpoints |
| product code | Lives outside \`usc/\`; specific to this system |

## USC Constructor

The executable USC constructor lives in the substrate repo:

\`\`\`text
narada.usc
\`\`\`

This repo contains construction work and product code for a specific system.

## Quick Start

1. Edit \`usc/construction-state.json\` to reflect current intent and state.
2. Use templates in \`usc/\` to create tasks, reviews, and closures.
3. Open construction cycles with \`usc cycle\`.
4. Validate from the substrate repo:
   \`\`\`bash
   cd /path/to/narada.usc
   pnpm usc -- validate --app ${targetDir}
   \`\`\`

${vars.CIS_NOTE}
`;

  writeFileSync(join(targetDir, "README.md"), readmeContent.trim() + "\n");

  const agentsContent = `# AGENTS.md — narada.usc.${name}

This is a USC-governed construction repo. Use \`usc/\` artifacts for construction discipline.

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
pnpm usc -- validate --app ${targetDir}
\`\`\`
`;

  writeFileSync(join(targetDir, "AGENTS.md"), agentsContent.trim() + "\n");

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
    writeFileSync(join(uscDir, file), rendered);
  }

  const now = new Date().toISOString();
  const taskGraph = {
    $schema: "https://narada2.dev/schemas/usc/task-graph.schema.json",
    schema_version: "1.0.0",
    app_id: name,
    created_at: now,
    updated_at: now,
    tasks: [
      {
        id: "T1",
        title: `Initial task for ${name}`,
        authority_locus: "principal",
        transformation: "Define the first executable transformation for this repo.",
        evidence_requirement: "Artifacts exist and demonstrate the transformation.",
        review_predicate: "A reviewer can verify the transformation from the evidence alone.",
        status: "draft",
        depends_on: [],
        inputs: [],
        expected_outputs: [],
        acceptance: { criteria: [] },
      },
    ],
    edges: [],
  };
  writeFileSync(join(uscDir, "task-graph.json"), JSON.stringify(taskGraph, null, 2));

  const constructionState = {
    $schema: "https://narada2.dev/schemas/usc/construction-state.schema.json",
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
    writeFileSync(join(uscDir, "policies", "cis-required.json"), JSON.stringify(cisPolicy, null, 2));
  }

  writeFileSync(join(uscDir, "construction-state.json"), JSON.stringify(constructionState, null, 2));

  if (initGit) {
    try {
      execSync("git init", { cwd: targetDir, stdio: "ignore" });
    } catch {
      // ignore
    }
  }

  return targetDir;
}

export { initRepo };
