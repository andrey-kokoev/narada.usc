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

function validateTaskGraphSemantics(data, name) {
  const errors = [];
  const taskIds = new Set((data.tasks || []).map((t) => t.id));

  for (const task of data.tasks || []) {
    const deps = [...(task.depends_on || []), ...(task.dependencies || [])];
    for (const depId of deps) {
      if (!taskIds.has(depId)) {
        errors.push(`task/${task.id}: missing dependency '${depId}'`);
      }
    }
  }

  if (errors.length > 0) {
    return { name, valid: false, errors };
  }
  return { name, valid: true, errors: [] };
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

  // Task graph examples
  const taskGraphsDir = join(rootDir, "examples", "task-graphs");
  if (existsSync(taskGraphsDir)) {
    // Valid examples
    const validFiles = ["valid-empty.json", "valid-with-tasks.json"];
    for (const file of validFiles) {
      const path = join(taskGraphsDir, file);
      if (!existsSync(path)) continue;
      const schemaResult = validateDocument(ajv, path, "https://narada2.dev/schemas/usc/task-graph.schema.json", `task-graphs/${file}`);
      results.push(schemaResult);
      if (!schemaResult.valid) allPassed = false;

      const data = JSON.parse(readFileSync(path, "utf8"));
      const semanticResult = validateTaskGraphSemantics(data, `task-graphs/${file} (semantic)`);
      results.push(semanticResult);
      if (!semanticResult.valid) allPassed = false;
    }

    // Invalid examples (should fail)
    const invalidFiles = [
      { file: "invalid-status.json", expectFail: true },
      { file: "invalid-claimed-without-metadata.json", expectFail: true },
      { file: "invalid-completed-without-result.json", expectFail: true },
      { file: "invalid-missing-dependency.json", expectFail: true },
    ];
    for (const { file, expectFail } of invalidFiles) {
      const path = join(taskGraphsDir, file);
      if (!existsSync(path)) continue;
      const data = JSON.parse(readFileSync(path, "utf8"));
      const schemaResult = validateDocument(ajv, path, "https://narada2.dev/schemas/usc/task-graph.schema.json", `task-graphs/${file}`);
      const semanticResult = validateTaskGraphSemantics(data, `task-graphs/${file} (semantic)`);

      // For missing-dependency, we expect semantic failure; for others, schema failure
      let failed = false;
      let errors = [];
      if (!schemaResult.valid) {
        failed = true;
        errors = schemaResult.errors;
      }
      if (!semanticResult.valid) {
        failed = true;
        errors = errors.concat(semanticResult.errors);
      }

      if (expectFail) {
        if (failed) {
          results.push({ name: `task-graphs/${file} (expected failure)`, valid: true, errors: [] });
        } else {
          results.push({ name: `task-graphs/${file} (expected failure)`, valid: false, errors: ["expected validation to fail, but it passed"] });
          allPassed = false;
        }
      } else {
        results.push(schemaResult);
        if (!schemaResult.valid) allPassed = false;
        results.push(semanticResult);
        if (!semanticResult.valid) allPassed = false;
      }
    }
  }

  // Refinement examples
  const refinementsDir = join(rootDir, "examples", "refinements");
  if (existsSync(refinementsDir)) {
    const refinementFiles = readdirSync(refinementsDir).filter((f) => f.endsWith(".json"));
    for (const file of refinementFiles) {
      const path = join(refinementsDir, file);
      const result = validateDocument(ajv, path, "https://narada2.dev/schemas/usc/refinement.schema.json", `refinements/${file}`);
      results.push(result);
      if (!result.valid) allPassed = false;
    }
  }

  // Domain prior examples (packaged in domain-packs/)
  const domainPacksDir = join(rootDir, "packages", "domain-packs");
  if (existsSync(domainPacksDir)) {
    const packNames = readdirSync(domainPacksDir).filter((name) => {
      const path = join(domainPacksDir, name);
      try {
        return statSync(path).isDirectory();
      } catch {
        return false;
      }
    });
    for (const packName of packNames) {
      const examplesDir = join(domainPacksDir, packName, "examples");
      if (!existsSync(examplesDir)) continue;
      const exampleFiles = readdirSync(examplesDir).filter((f) => f.endsWith(".json"));
      for (const file of exampleFiles) {
        const path = join(examplesDir, file);
        const result = validateDocument(ajv, path, "https://narada2.dev/schemas/usc/refinement.schema.json", `domain-packs/${packName}/${file}`);
        results.push(result);
        if (!result.valid) allPassed = false;
      }
    }
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
      const data = JSON.parse(readFileSync(tgPath, "utf8"));
      const semResult = validateTaskGraphSemantics(data, `sessions/${sessionName}/task-graph (semantic)`);
      results.push(semResult);
      if (!semResult.valid) allPassed = false;
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
      const data = JSON.parse(readFileSync(tgPath, "utf8"));
      const semResult = validateTaskGraphSemantics(data, `app/${appName}/usc/task-graph (semantic)`);
      results.push(semResult);
      if (!semResult.valid) allPassed = false;
    }
  }

  return { results, allPassed };
}

export { validateAll, validateTaskGraphSemantics };
