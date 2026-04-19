import { existsSync } from "fs";
import { join } from "path";
import { readJson } from "@narada.usc/core/src/atomic-json.js";
import { runExecutor } from "./executors/index.js";

async function executeTask({ target, taskId, executorName, dryRun }) {
  const repoDir = target.startsWith("/") ? target : join(process.cwd(), target);
  const uscDir = join(repoDir, "usc");

  if (!existsSync(uscDir)) {
    throw new Error(`No USC construction repo found at '${repoDir}'. Expected 'usc/' directory.`);
  }

  const taskGraphPath = join(uscDir, "task-graph.json");
  if (!existsSync(taskGraphPath)) {
    throw new Error(`No task graph found at '${taskGraphPath}'. Run 'usc plan --target ${target}' first.`);
  }

  const taskGraph = readJson(taskGraphPath);
  const task = (taskGraph.tasks || []).find((t) => t.id === taskId);
  if (!task) {
    throw new Error(`Task '${taskId}' not found in task graph.`);
  }

  if (task.status !== "claimed") {
    throw new Error(`Task '${taskId}' is not claimed (status: ${task.status}). Run 'usc next --target ${target}' first.`);
  }

  if (dryRun) {
    return {
      dryRun: true,
      executor: executorName,
      task: { id: task.id, title: task.title, status: task.status },
      repoDir,
    };
  }

  const result = await runExecutor({ executorName, task, repoDir, context: {} });
  return {
    dryRun: false,
    executor: executorName,
    task: { id: task.id, title: task.title },
    repoDir,
    result,
  };
}

export { executeTask };
