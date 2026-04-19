import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Enterprise Resource Planning
 *
 * Reusable construction grammar for ERP problem families.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "erp",
  name: "Enterprise Resource Planning",
  detect,
  refine,
};

export { detect, refine };
