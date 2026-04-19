import { nextTask, executeTask } from "./index.js";

async function runLoop({ target, executorName, maxSteps, dryRun }) {
  const steps = [];
  const limit = maxSteps ?? 1;

  for (let i = 0; i < limit; i++) {
    // 1. Claim next runnable task
    const nextResult = nextTask({ target, claimant: "loop" });
    if (!nextResult.task) {
      steps.push({ step: i + 1, action: "stop", reason: "no_runnable_tasks" });
      break;
    }

    const task = nextResult.task;

    // 2. Execute via adapter
    let execResult;
    try {
      execResult = await executeTask({
        target,
        taskId: task.id,
        executorName,
        dryRun: dryRun || false,
      });
    } catch (err) {
      steps.push({ step: i + 1, action: "execute_error", task: task.id, error: err.message });
      break;
    }

    // 3. Record step outcome
    // For v1, never auto-complete unless executor explicitly declares it
    const autoComplete = execResult.result && execResult.result.auto_complete === true;
    steps.push({
      step: i + 1,
      action: "execute",
      task: task.id,
      title: task.title,
      executor: executorName,
      dryRun: dryRun || false,
      artifactPath: execResult.result ? execResult.result.artifactPath : null,
      autoComplete,
      completed: false, // v1: always false unless we add auto-complete later
    });
  }

  return { target, steps, totalSteps: steps.length };
}

export { runLoop };
