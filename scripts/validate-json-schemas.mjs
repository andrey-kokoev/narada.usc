import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const schemasDir = join(rootDir, "schemas");

const ajv = new Ajv({ strict: false });
addFormats(ajv);

// Parse optional --app argument
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        args[key] = next;
        i++;
      }
    }
  }
  return args;
}
const runArgs = parseArgs(process.argv.slice(2));
const appPath = runArgs.app;

// Load and register all schemas by their $id
const schemaFiles = readdirSync(schemasDir).filter((f) => f.endsWith(".schema.json"));
for (const file of schemaFiles) {
  const path = join(schemasDir, file);
  const schema = JSON.parse(readFileSync(path, "utf8"));
  ajv.addSchema(schema);
}

const validations = [
  {
    dataPath: join(rootDir, "examples", "minimal-construction-state.json"),
    schemaId: "https://narada2.dev/schemas/usc/construction-state.schema.json",
    name: "minimal-construction-state",
  },
  {
    dataPath: join(rootDir, "examples", "full-cycle", "construction-state.json"),
    schemaId: "https://narada2.dev/schemas/usc/construction-state.schema.json",
    name: "full-cycle/construction-state",
  },
  {
    dataPath: join(rootDir, "examples", "full-cycle", "04-task-graph.json"),
    schemaId: "https://narada2.dev/schemas/usc/task-graph.schema.json",
    name: "full-cycle/04-task-graph",
  },
  {
    dataPath: join(rootDir, "examples", "policies", "cis-required.json"),
    schemaId: "https://narada2.dev/schemas/usc/admissibility-policy.schema.json",
    name: "policies/cis-required",
  },
];

let allPassed = true;

for (const { dataPath, schemaId, name } of validations) {
  const data = JSON.parse(readFileSync(dataPath, "utf8"));
  const validate = ajv.getSchema(schemaId);
  if (!validate) {
    console.error(`FAIL ${name}: could not load schema ${schemaId}`);
    allPassed = false;
    continue;
  }
  const valid = validate(data);
  if (valid) {
    console.log(`PASS ${name}`);
  } else {
    console.error(`FAIL ${name}`);
    for (const err of validate.errors) {
      console.error(`  ${err.instancePath || "/"}: ${err.message}`);
    }
    allPassed = false;
  }
}

// Validate generated sessions
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
  // no sessions directory
}

for (const sessionName of sessionDirs) {
  const sessionPath = join(sessionsDir, sessionName);

  const csPath = join(sessionPath, "construction-state.json");
  if (existsSync(csPath)) {
    const data = JSON.parse(readFileSync(csPath, "utf8"));
    const validate = ajv.getSchema("https://narada2.dev/schemas/usc/construction-state.schema.json");
    const valid = validate(data);
    if (valid) {
      console.log(`PASS sessions/${sessionName}/construction-state`);
    } else {
      console.error(`FAIL sessions/${sessionName}/construction-state`);
      for (const err of validate.errors) {
        console.error(`  ${err.instancePath || "/"}: ${err.message}`);
      }
      allPassed = false;
    }
  }

  const tgPath = join(sessionPath, "task-graph.json");
  if (existsSync(tgPath)) {
    const data = JSON.parse(readFileSync(tgPath, "utf8"));
    const validate = ajv.getSchema("https://narada2.dev/schemas/usc/task-graph.schema.json");
    const valid = validate(data);
    if (valid) {
      console.log(`PASS sessions/${sessionName}/task-graph`);
    } else {
      console.error(`FAIL sessions/${sessionName}/task-graph`);
      for (const err of validate.errors) {
        console.error(`  ${err.instancePath || "/"}: ${err.message}`);
      }
      allPassed = false;
    }
  }
}

// Validate external app repo if --app is provided
if (appPath) {
  const appUscDir = join(appPath, "usc");
  const appName = appPath.split("/").pop();

  const csPath = join(appUscDir, "construction-state.json");
  if (existsSync(csPath)) {
    const data = JSON.parse(readFileSync(csPath, "utf8"));
    const validate = ajv.getSchema("https://narada2.dev/schemas/usc/construction-state.schema.json");
    const valid = validate(data);
    if (valid) {
      console.log(`PASS app/${appName}/usc/construction-state`);
    } else {
      console.error(`FAIL app/${appName}/usc/construction-state`);
      for (const err of validate.errors) {
        console.error(`  ${err.instancePath || "/"}: ${err.message}`);
      }
      allPassed = false;
    }
  }

  const tgPath = join(appUscDir, "task-graph.json");
  if (existsSync(tgPath)) {
    const data = JSON.parse(readFileSync(tgPath, "utf8"));
    const validate = ajv.getSchema("https://narada2.dev/schemas/usc/task-graph.schema.json");
    const valid = validate(data);
    if (valid) {
      console.log(`PASS app/${appName}/usc/task-graph`);
    } else {
      console.error(`FAIL app/${appName}/usc/task-graph`);
      for (const err of validate.errors) {
        console.error(`  ${err.instancePath || "/"}: ${err.message}`);
      }
      allPassed = false;
    }
  }
}

if (!allPassed) {
  process.exit(1);
}

console.log("\nAll validations passed.");
