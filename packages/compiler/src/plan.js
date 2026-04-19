import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { readJson, writeJson } from "@narada.usc/core/src/atomic-json.js";

function isInitPlaceholder(taskGraph) {
  const tasks = taskGraph.tasks || [];
  if (tasks.length !== 1) return false;
  const t = tasks[0];
  return t.id === "T1" && t.title && t.title.startsWith("Initial task for");
}

function plan({ target, from, force }) {
  const repoDir = target.startsWith("/") ? target : join(process.cwd(), target);
  const uscDir = join(repoDir, "usc");

  if (!existsSync(uscDir)) {
    throw new Error(`No USC construction repo found at '${repoDir}'. Expected 'usc/' directory.`);
  }

  const refinementPath = from || join(uscDir, "refinement.json");
  if (!existsSync(refinementPath)) {
    throw new Error(`No refinement found at '${refinementPath}'. Run 'usc refine --target ${target}' first.`);
  }

  const taskGraphPath = join(uscDir, "task-graph.json");
  let isPlaceholder = false;
  if (existsSync(taskGraphPath) && !force) {
    const existing = readJson(taskGraphPath);
    isPlaceholder = isInitPlaceholder(existing);
    if (!isPlaceholder) {
      throw new Error(`Task graph already exists at '${taskGraphPath}'. Use --force to overwrite.`);
    }
  }

  const refinement = JSON.parse(readFileSync(refinementPath, "utf8"));
  const seedTasks = refinement.seed_tasks || [];
  const residuals = refinement.residuals || [];

  const now = new Date().toISOString();
  const tasks = [];

  // Blocking residuals become pending resolution tasks
  const blockingResiduals = residuals.filter((r) => r.blocking);
  const blockingResidualIds = blockingResiduals.map((r) => r.residual_id);

  for (const residual of blockingResiduals) {
    tasks.push({
      id: residual.residual_id,
      title: `Resolve: ${residual.description}`,
      authority_locus: "principal",
      transformation: `Resolve the blocking residual: ${residual.description}`,
      evidence_requirement: "Residual is documented as resolved or closed.",
      review_predicate: "A reviewer agrees the residual no longer blocks construction.",
      status: "proposed",
      depends_on: [],
      inputs: [{ name: "principal_decision", description: "The decision or information needed to resolve this residual.", source: "principal" }],
      expected_outputs: [{ name: "resolution_document", description: "Documented resolution of the residual", format: "markdown" }],
      acceptance: { criteria: ["Residual is no longer blocking construction"] },
    });
  }

  // Convert seed tasks to graph tasks; they depend on all blocking residuals
  for (const seed of seedTasks) {
    tasks.push({
      id: seed.id,
      title: seed.title,
      authority_locus: seed.authority_locus || "principal",
      transformation: seed.transformation,
      evidence_requirement: seed.evidence_requirement,
      review_predicate: seed.review_predicate,
      status: "proposed",
      depends_on: [...blockingResidualIds],
      inputs: [{ name: "refinement_context", description: "Context from intent refinement", source: "refinement" }],
      expected_outputs: [{ name: "task_evidence", description: "Evidence satisfying the evidence requirement", format: "artifact" }],
      acceptance: { criteria: [seed.review_predicate] },
    });
  }

  const taskGraph = {
    $schema: "https://narada2.dev/schemas/usc/task-graph.schema.json",
    schema_version: "1.0.0",
    app_id: refinement.detected_domain || "unknown",
    created_at: now,
    updated_at: now,
    tasks,
    edges: [],
  };

  writeJson(taskGraphPath, taskGraph);

  // Compute summary
  const taskCount = tasks.length;
  const admittedCount = tasks.filter((t) => t.status === "admitted").length;
  const proposedCount = tasks.filter((t) => t.status === "proposed").length;

  return {
    taskGraphPath,
    summary: {
      task_count: taskCount,
      proposed_count: proposedCount,
      admitted_count: admittedCount,
    },
  };
}

export { plan };
