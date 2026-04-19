import { detect, refine } from "./refinement.js";

/**
 * USC Domain Pack: Knowledge Base
 *
 * Reusable construction grammar for knowledge base and documentation systems.
 * Does not assume RAG/LLM use.
 * Does not contain app-specific decisions, product code, or secrets.
 */
export default {
  id: "knowledge-base",
  name: "Knowledge Base",
  detect,
  refine,
};

export { detect, refine };
