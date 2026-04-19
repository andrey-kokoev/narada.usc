import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Learning Management
 *
 * Reusable construction grammar for LMS, training, courses, assessment, and learning operations.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "learning-management",
  name: "Learning Management",
  detect,
  refine,
};

export { detect, refine };
