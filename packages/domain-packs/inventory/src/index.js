import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Inventory
 *
 * Reusable construction grammar for inventory and stock management systems.
 * Does not assume FIFO/LIFO/weighted-average costing.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "inventory",
  name: "Inventory",
  detect,
  refine,
};

export { detect, refine };
