import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: CRM
 *
 * Reusable construction grammar for customer relationship management systems.
 * Does not assume sales-led CRM only.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "crm",
  name: "CRM",
  detect,
  refine,
};

export { detect, refine };
