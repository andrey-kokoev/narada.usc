import { runManual } from "./manual.js";
import { runSubprocess } from "./subprocess.js";

const registry = {
  manual: runManual,
  subprocess: runSubprocess,
};

async function runExecutor({ executorName, task, repoDir, context }) {
  const fn = registry[executorName];
  if (!fn) {
    throw new Error(`Unknown executor '${executorName}'. Available: ${Object.keys(registry).join(", ")}.`);
  }
  return fn(task, repoDir, context);
}

export { runExecutor, registry };
