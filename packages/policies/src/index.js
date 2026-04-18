import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const examplesDir = join(__dirname, "..", "examples");

const cisRequiredPolicy = JSON.parse(
  readFileSync(join(examplesDir, "cis-required.json"), "utf8")
);

const policyIds = {
  cisRequiredV1: "policy-cis-required-v1",
};

export { cisRequiredPolicy, policyIds };
