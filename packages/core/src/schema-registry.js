import { readFileSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemasDir = join(__dirname, "..", "schemas");

const schemaIds = {
  constructionState: "https://narada2.dev/schemas/usc/construction-state.schema.json",
  taskGraph: "https://narada2.dev/schemas/usc/task-graph.schema.json",
  task: "https://narada2.dev/schemas/usc/task.schema.json",
  review: "https://narada2.dev/schemas/usc/review.schema.json",
  residual: "https://narada2.dev/schemas/usc/residual.schema.json",
  closureRecord: "https://narada2.dev/schemas/usc/closure-record.schema.json",
  decisionSurface: "https://narada2.dev/schemas/usc/decision-surface.schema.json",
  session: "https://narada2.dev/schemas/usc/session.schema.json",
  admissibilityPolicy: "https://narada2.dev/schemas/usc/admissibility-policy.schema.json",
  downstreamRuntimeObservation: "https://narada2.dev/schemas/usc/downstream-runtime-observation.schema.json",
};

function loadSchemas() {
  const files = readdirSync(schemasDir).filter((f) => f.endsWith(".schema.json"));
  const schemas = {};
  for (const file of files) {
    const path = join(schemasDir, file);
    const schema = JSON.parse(readFileSync(path, "utf8"));
    schemas[schema.$id || file] = schema;
  }
  return schemas;
}

function getSchemaPath(name) {
  return join(schemasDir, name);
}

function getSchemasDir() {
  return schemasDir;
}

export { schemaIds, loadSchemas, getSchemaPath, getSchemasDir };
