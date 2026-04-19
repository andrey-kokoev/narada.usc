import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Asset Management
 *
 * Reusable construction grammar for physical/digital asset tracking, assignment, maintenance, and lifecycle systems.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "asset-management",
  name: "Asset Management",
  detect,
  refine,
};

export { detect, refine };
