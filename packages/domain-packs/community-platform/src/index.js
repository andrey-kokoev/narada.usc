import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Community Platform
 *
 * Reusable construction grammar for forums, member communities, groups, events, and moderation systems.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "community-platform",
  name: "Community Platform",
  detect,
  refine,
};

export { detect, refine };
