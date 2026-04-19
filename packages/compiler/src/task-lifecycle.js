import { existsSync } from "fs";
import { join } from "path";
import { readJson, writeJson } from "@narada.usc/core/src/atomic-json.js";

function loadTaskGraph(target) {
  const repoDir = target.startsWith("/") ? target : join(process.cwd(), target);
  const uscDir = join(repoDir, "usc");
  if (!existsSync(uscDir)) {
    throw new Error(`No USC construction repo found at '${repoDir}'. Expected 'usc/' directory.`);
  }
  const taskGraphPath = join(uscDir, "task-graph.json");
  if (!existsSync(taskGraphPath)) {
    throw new Error(`No task graph found at '${taskGraphPath}'. Run 'usc plan --target ${target}' first.`);
  }
  return { repoDir, uscDir, taskGraphPath, taskGraph: readJson(taskGraphPath) };
}

function saveTaskGraph(taskGraphPath, taskGraph) {
  taskGraph.updated_at = new Date().toISOString();
  writeJson(taskGraphPath, taskGraph);
}

function findTask(taskGraph, taskId) {
  const task = (taskGraph.tasks || []).find((t) => t.id === taskId);
  if (!task) {
    throw new Error(`Task '${taskId}' not found in task graph.`);
  }
  return task;
}

function isRunnable(task, tasks) {
  if (task.status !== "pending") return false;
  const deps = [...(task.depends_on || []), ...(task.dependencies || [])];
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  return deps.every((depId) => {
    const dep = taskMap.get(depId);
    return dep && dep.status === "completed";
  });
}

function nextTask({ target, claimant, dryRun }) {
  const { taskGraphPath, taskGraph } = loadTaskGraph(target);
  const tasks = taskGraph.tasks || [];

  // Deterministic: first runnable task in array order
  const runnable = tasks.filter((t) => isRunnable(t, tasks));
  if (runnable.length === 0) {
    return { task: null, taskGraphPath, summary: { action: "next", claimed: null, reason: "no_runnable_tasks" } };
  }

  const task = runnable[0];
  const now = new Date().toISOString();
  task.status = "claimed";
  task.claim = {
    claimant: claimant || "unknown",
    claimed_at: now,
  };

  if (!dryRun) {
    saveTaskGraph(taskGraphPath, taskGraph);
  }
  return { task, taskGraphPath, summary: { action: "next", claimed: task.id } };
}

function completeTask({ target, taskId, resultFile, claimant, reviewer }) {
  const { taskGraphPath, taskGraph } = loadTaskGraph(target);
  const task = findTask(taskGraph, taskId);

  if (task.status !== "claimed") {
    throw new Error(`Task '${taskId}' is not claimed (status: ${task.status}). Only claimed tasks can be completed.`);
  }

  if (!existsSync(resultFile)) {
    throw new Error(`Result file '${resultFile}' does not exist.`);
  }

  if (!reviewer) {
    throw new Error(`Completion requires an explicit reviewer. Use --reviewer <id>.`);
  }

  const now = new Date().toISOString();
  task.status = "completed";
  task.result = {
    artifact_reference: resultFile,
    completed_at: now,
    completed_by: claimant || (task.claim && task.claim.claimant) || "unknown",
    reviewed_by: reviewer,
  };

  saveTaskGraph(taskGraphPath, taskGraph);
  return { task, taskGraphPath, summary: { action: "complete", task: taskId } };
}

function rejectTask({ target, taskId, reason, reviewer }) {
  const { taskGraphPath, taskGraph } = loadTaskGraph(target);
  const task = findTask(taskGraph, taskId);

  if (task.status === "rejected") {
    throw new Error(`Task '${taskId}' is already rejected.`);
  }

  const now = new Date().toISOString();
  task.status = "rejected";
  task.review = {
    reviewer: reviewer || "unknown",
    outcome: "reject",
    reason: reason || "No reason provided.",
    reviewed_at: now,
  };

  saveTaskGraph(taskGraphPath, taskGraph);
  return { task, taskGraphPath, summary: { action: "reject", task: taskId } };
}

function blockTask({ target, taskId, reason, until }) {
  const { taskGraphPath, taskGraph } = loadTaskGraph(target);
  const task = findTask(taskGraph, taskId);

  if (task.status === "blocked") {
    throw new Error(`Task '${taskId}' is already blocked.`);
  }

  const now = new Date().toISOString();
  task.status = "blocked";
  task.block = {
    reason: reason || "No reason provided.",
    unblock_condition: until || "No unblock condition provided.",
  };

  saveTaskGraph(taskGraphPath, taskGraph);
  return { task, taskGraphPath, summary: { action: "block", task: taskId } };
}

export { nextTask, completeTask, rejectTask, blockTask };
