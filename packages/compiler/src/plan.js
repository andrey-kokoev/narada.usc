import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { readJson, writeJson } from "@narada.usc/core/src/atomic-json.js";

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
  if (existsSync(taskGraphPath) && !force) {
    throw new Error(`Task graph already exists at '${taskGraphPath}'. Use --force to overwrite.`);
  }

  const refinement = JSON.parse(readFileSync(refinementPath, "utf8"));
  const seedTasks = refinement.seed_tasks || [];
  const residuals = refinement.residuals || [];

  const now = new Date().toISOString();
  const tasks = [];

  // Convert seed tasks to graph tasks
  for (const seed of seedTasks) {
    tasks.push({
      id: seed.id,
      title: seed.title,
      authority_locus: seed.authority_locus || "principal",
      transformation: seed.transformation,
      evidence_requirement: seed.evidence_requirement,
      review_predicate: seed.review_predicate,
      status: "pending",
      depends_on: [],
    });
  }

  // Emit blocked tasks for blocking residuals
  const blockingResiduals = residuals.filter((r) => r.blocking);
  for (const residual of blockingResiduals) {
    tasks.push({
      id: residual.residual_id,
      title: `Resolve: ${residual.description}`,
      authority_locus: "principal",
      transformation: `Resolve the blocking residual: ${residual.description}`,
      evidence_requirement: "Residual is documented as resolved or closed.",
      review_predicate: "A reviewer agrees the residual no longer blocks construction.",
      status: "blocked",
      depends_on: [],
      block: {
        reason: residual.description,
        unblock_condition: "Principal provides the required decision or information.",
      },
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
  const blockedCount = tasks.filter((t) => t.status === "blocked").length;
  const runnableCount = tasks.filter((t) => {
    if (t.status !== "pending" && t.status !== "open") return false;
    const deps = [...(t.depends_on || []), ...(t.dependencies || [])];
    return deps.every((depId) => {
      const dep = tasks.find((task) => task.id === depId);
      return dep && dep.status === "completed";
    });
  }).length;

  return {
    taskGraphPath,
    summary: {
      task_count: taskCount,
      runnable_count: runnableCount,
      blocked_count: blockedCount,
    },
  };
}

export { plan };
