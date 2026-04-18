import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgDir = join(__dirname, "..");
const schemasDir = join(pkgDir, "schemas");

function createAjv() {
  const ajv = new Ajv({ strict: false });
  addFormats(ajv);

  const schemaFiles = readdirSync(schemasDir).filter((f) => f.endsWith(".schema.json"));
  for (const file of schemaFiles) {
    const path = join(schemasDir, file);
    const schema = JSON.parse(readFileSync(path, "utf8"));
    ajv.addSchema(schema);
  }

  return ajv;
}

function validateDocument(ajv, dataPath, schemaId, name) {
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  const validate = ajv.getSchema(schemaId);
  if (!validate) {
    return { name, valid: false, errors: [`could not load schema ${schemaId}`] };
  }
  const valid = validate(data);
  if (valid) {
    return { name, valid: true, errors: [] };
  }
  return {
    name,
    valid: false,
    errors: validate.errors.map((err) => `${err.instancePath || "/"}: ${err.message}`),
  };
}

function validateAll(options = {}) {
  const ajv = createAjv();
  const rootDir = options.rootDir || join(pkgDir, "..", "..");
  const appPath = options.appPath;
  const results = [];
  let allPassed = true;

  // Canonical examples
  const examples = [
    { path: join(rootDir, "examples", "minimal-construction-state.json"), schema: "https://narada2.dev/schemas/usc/construction-state.schema.json", name: "minimal-construction-state" },
    { path: join(rootDir, "examples", "full-cycle", "construction-state.json"), schema: "https://narada2.dev/schemas/usc/construction-state.schema.json", name: "full-cycle/construction-state" },
    { path: join(rootDir, "examples", "full-cycle", "04-task-graph.json"), schema: "https://narada2.dev/schemas/usc/task-graph.schema.json", name: "full-cycle/04-task-graph" },
    { path: join(rootDir, "packages", "policies", "examples", "cis-required.json"), schema: "https://narada2.dev/schemas/usc/admissibility-policy.schema.json", name: "policies/cis-required" },
  ];

  for (const ex of examples) {
    if (!existsSync(ex.path)) continue;
    const result = validateDocument(ajv, ex.path, ex.schema, ex.name);
    results.push(result);
    if (!result.valid) allPassed = false;
  }

  // Sessions
  const sessionsDir = join(rootDir, "sessions");
  let sessionDirs = [];
  try {
    sessionDirs = readdirSync(sessionsDir).filter((name) => {
      const path = join(sessionsDir, name);
      try {
        return statSync(path).isDirectory();
      } catch {
        return false;
      }
    });
  } catch {
    // no sessions
  }

  for (const sessionName of sessionDirs) {
    const sessionPath = join(sessionsDir, sessionName);
    const csPath = join(sessionPath, "construction-state.json");
    if (existsSync(csPath)) {
      const result = validateDocument(ajv, csPath, "https://narada2.dev/schemas/usc/construction-state.schema.json", `sessions/${sessionName}/construction-state`);
      results.push(result);
      if (!result.valid) allPassed = false;
    }
    const tgPath = join(sessionPath, "task-graph.json");
    if (existsSync(tgPath)) {
      const result = validateDocument(ajv, tgPath, "https://narada2.dev/schemas/usc/task-graph.schema.json", `sessions/${sessionName}/task-graph`);
      results.push(result);
      if (!result.valid) allPassed = false;
    }
  }

  // External app repo
  if (appPath) {
    const appUscDir = join(appPath, "usc");
    const appName = appPath.split("/").pop();
    const csPath = join(appUscDir, "construction-state.json");
    if (existsSync(csPath)) {
      const result = validateDocument(ajv, csPath, "https://narada2.dev/schemas/usc/construction-state.schema.json", `app/${appName}/usc/construction-state`);
      results.push(result);
      if (!result.valid) allPassed = false;
    }
    const tgPath = join(appUscDir, "task-graph.json");
    if (existsSync(tgPath)) {
      const result = validateDocument(ajv, tgPath, "https://narada2.dev/schemas/usc/task-graph.schema.json", `app/${appName}/usc/task-graph`);
      results.push(result);
      if (!result.valid) allPassed = false;
    }
  }

  return { results, allPassed };
}

export { validateAll };
