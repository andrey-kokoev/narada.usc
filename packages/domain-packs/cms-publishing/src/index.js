import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: CMS Publishing
 *
 * Reusable construction grammar for content management, publishing, editorial workflow, and documentation systems.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "cms-publishing",
  name: "CMS Publishing",
  detect,
  refine,
};

export { detect, refine };
