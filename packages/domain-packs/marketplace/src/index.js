import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Marketplace
 *
 * Reusable construction grammar for marketplace, multi-vendor, and platform commerce systems.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "marketplace",
  name: "Marketplace",
  detect,
  refine,
};

export { detect, refine };
