import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

async function runSubprocess(task, repoDir, context) {
  const configPath = join(repoDir, "usc", "executor-config.json");
  if (!existsSync(configPath)) {
    throw new Error(`Subprocess executor requires 'usc/executor-config.json' in the target repo. Create one with { "command": "...", "args": [] }.`);
  }

  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const command = config.command;
  const args = config.args || [];

  if (!command) {
    throw new Error("executor-config.json must specify a 'command'.");
  }

  const taskContext = JSON.stringify({
    task,
    repo: repoDir,
    context,
  });

  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoDir,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => { stdout += data; });
    child.stderr.on("data", (data) => { stderr += data; });

    child.on("close", (exitCode) => {
      resolve({
        artifactPath: null,
        exitCode: exitCode || 0,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
      });
    });

    child.on("error", (err) => {
      reject(new Error(`Subprocess executor failed: ${err.message}`));
    });

    child.stdin.write(taskContext);
    child.stdin.end();
  });
}

export { runSubprocess };
