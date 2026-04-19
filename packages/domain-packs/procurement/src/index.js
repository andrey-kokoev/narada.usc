import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Procurement
 *
 * Reusable construction grammar for purchasing, vendors, approvals, purchase orders, receiving, and spend control.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "procurement",
  name: "Procurement",
  detect,
  refine,
};

export { detect, refine };
