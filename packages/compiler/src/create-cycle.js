import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

function createCycle({ target, name, intent, force }) {
  const repoDir = target.startsWith("/") ? target : join(process.cwd(), target);
  const uscDir = join(repoDir, "usc");

  if (!existsSync(uscDir)) {
    throw new Error(
      `No USC construction repo found at '${repoDir}'. Expected 'usc/' directory. ` +
        `If running through pnpm --dir, pass --target <repo>.`
    );
  }

  const cyclesDir = join(uscDir, "cycles");
  if (!existsSync(cyclesDir)) {
    mkdirSync(cyclesDir, { recursive: true });
  }

  const cycleName = name || `cycle-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  const cycleDir = join(cyclesDir, cycleName);

  if (existsSync(cycleDir) && !force) {
    throw new Error(`Cycle '${cycleName}' already exists. Use --force to overwrite.`);
  }

  mkdirSync(cycleDir, { recursive: true });

  const timestamp = new Date().toISOString();
  const cycleManifest = {
    name: cycleName,
    intent: intent || "TBD",
    opened_at: timestamp,
  };
  writeFileSync(join(cycleDir, "cycle.json"), JSON.stringify(cycleManifest, null, 2));

  // Snapshot current construction state into the cycle if it exists
  const csPath = join(uscDir, "construction-state.json");
  if (existsSync(csPath)) {
    writeFileSync(join(cycleDir, "construction-state.json"), readFileSync(csPath, "utf8"));
  }

  const tgPath = join(uscDir, "task-graph.json");
  if (existsSync(tgPath)) {
    writeFileSync(join(cycleDir, "task-graph.json"), readFileSync(tgPath, "utf8"));
  }

  return cycleDir;
}

export { createCycle };
