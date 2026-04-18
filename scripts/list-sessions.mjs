import { readdirSync, statSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sessionsDir = join(__dirname, "..", "sessions");

let sessions = [];
try {
  sessions = readdirSync(sessionsDir).filter((name) => {
    const path = join(sessionsDir, name);
    return statSync(path).isDirectory();
  });
} catch {
  console.log("No sessions directory found.");
  process.exit(0);
}

if (sessions.length === 0) {
  console.log("No sessions found.");
  process.exit(0);
}

for (const name of sessions) {
  const sessionDir = join(sessionsDir, name);
  let meta = {};
  try {
    const statePath = join(sessionDir, "construction-state.json");
    const state = JSON.parse(readFileSync(statePath, "utf8"));
    meta.principal = state.intent?.principal;
    meta.intent = state.intent?.statement;
  } catch {
    // ignore
  }
  const parts = [`- ${name}`];
  if (meta.principal) parts.push(`principal: ${meta.principal}`);
  if (meta.intent) parts.push(`intent: ${meta.intent.slice(0, 60)}${meta.intent.length > 60 ? "..." : ""}`);
  console.log(parts.join("  "));
}
