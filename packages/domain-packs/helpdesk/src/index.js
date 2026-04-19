import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Support Helpdesk
 *
 * Reusable construction grammar for support helpdesk problem families.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "helpdesk",
  name: "Support Helpdesk",
  detect,
  refine,
};

export { detect, refine };
