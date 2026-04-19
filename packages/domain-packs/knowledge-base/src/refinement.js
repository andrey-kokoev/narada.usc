export function detect(intent) {
  const text = intent.toLowerCase();
  const score =
    (/\bknowledge base\b/.test(text) ? 3 : 0) +
    (/\bknowledgebase\b/.test(text) ? 3 : 0) +
    (/\bwiki\b/.test(text) ? 2 : 0) +
    (/\bdocumentation\b/.test(text) ? 2 : 0) +
    (/\bhelp center\b/.test(text) ? 2 : 0) +
    (/\bself-service\b/.test(text) ? 1 : 0) +
    (/\bfaq\b/.test(text) ? 1 : 0);
  return score > 0 ? score : false;
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Content types (articles, guides, FAQs, troubleshooting, API docs, video)", governing: true },
      { layer: "ontology", description: "Audience model (internal, external, customers, partners, public, role-based)", governing: true },
      { layer: "dynamics", description: "Authoring and publishing workflow (draft, review, publish, archive, deprecation)", governing: true },
      { layer: "dynamics", description: "Organization and discovery (categories, tags, search, hierarchy, cross-links)", governing: true },
      { layer: "normativity", description: "Content governance (ownership, freshness policy, review cycles, style guide)", governing: true },
      { layer: "environment", description: "Search and retrieval (full-text, faceted, semantic, related content, auto-suggest)", governing: true },
      { layer: "environment", description: "Feedback and improvement (ratings, comments, analytics, missing-content signals)", governing: true },
      { layer: "normativity", description: "Access control (public, authenticated, role-based, IP-restricted, SSO)", governing: true },
      { layer: "environment", description: "Integration with support, chat, or product systems (contextual help, in-app, chatbot)", governing: true },
      { layer: "dynamics", description: "Localization and multi-language (separate articles, translation workflow, fallback)", governing: true },
      { layer: "environment", description: "Import and migration (existing docs, Confluence, Notion, Markdown, PDF)", governing: true },
      { layer: "stopping", description: "MVP knowledge base boundary — what content types and audiences are in scope", governing: true },
    ],
    questions: [
      { question: "What content types must be supported in MVP?", authority: "principal", blocking: true },
      { question: "Who is the primary audience (internal, external, customers, partners)?", authority: "principal", blocking: true },
      { question: "What authoring and publishing workflow is required?", authority: "principal", blocking: true },
      { question: "What search and discovery features are required?", authority: "principal", blocking: false },
      { question: "What content governance rules apply (freshness, ownership, style)?", authority: "principal", blocking: false },
      { question: "What access control model is required?", authority: "principal", blocking: false },
      { question: "Must this integrate with support, chat, or in-app help?", authority: "semantic", blocking: false },
      { question: "Is multi-language content required?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "Articles and guides are the core MVP content types", confidence: "medium", reversible: true },
      { assumption: "A draft → review → publish workflow is acceptable for MVP", confidence: "medium", reversible: true },
      { assumption: "Full-text search with basic tagging is sufficient initially", confidence: "medium", reversible: true },
      { assumption: "Single-language content is acceptable for MVP", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Knowledge base construction will start with articles and guides under a draft → review → publish workflow with full-text search and basic access control.", rationale: "A focused content model and conservative workflow reduce risk while preserving principal control over content quality and audience access.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T1", title: "Define content types and taxonomy", authority_locus: "principal", transformation: "Document content types, category structure, and how content is organized.", evidence_requirement: "Content type and taxonomy document exists.", review_predicate: "Every content type has a defined structure and placement in the taxonomy." },
      { id: "T2", title: "Define audience and access model", authority_locus: "principal", transformation: "Document who can read, who can write, and how access is enforced.", evidence_requirement: "Audience and access model exists.", review_predicate: "Every audience segment has a defined access level; no content is unintentionally public." },
      { id: "T3", title: "Define authoring and publishing workflow", authority_locus: "principal", transformation: "Document content states, transitions, reviewers, and approval rules.", evidence_requirement: "Publishing workflow document exists.", review_predicate: "Every content state has a clear exit criteria and authorized actor." },
      { id: "T4", title: "Define content governance policy", authority_locus: "principal", transformation: "Document ownership rules, freshness requirements, review cycles, and deprecation.", evidence_requirement: "Content governance policy exists.", review_predicate: "Every article has an owner and a review date; stale content is flagged." },
      { id: "T5", title: "Define search and discovery requirements", authority_locus: "principal", transformation: "Document search features, related content rules, and discovery mechanisms.", evidence_requirement: "Search and discovery specification exists.", review_predicate: "A user can find common content without knowing exact titles." },
      { id: "T6", title: "Define MVP knowledge base boundary", authority_locus: "principal", transformation: "Explicitly list content types, audiences, and features in MVP and what is out of scope.", evidence_requirement: "MVP scope document exists with explicit inclusions and exclusions.", review_predicate: "Scope is achievable and every excluded content type is consciously deferred." },
    ],
    residuals: [
      { residual_id: "res-content-types", class: "unresolved_principal_decision", description: "Content types for MVP are not defined.", blocking: true },
      { residual_id: "res-audience", class: "unresolved_principal_decision", description: "Audience and access model are not decided.", blocking: true },
      { residual_id: "res-workflow", class: "unresolved_principal_decision", description: "Authoring and publishing workflow is not established.", blocking: true },
      { residual_id: "res-governance", class: "missing_policy", description: "Content governance policy is undocumented.", blocking: false },
      { residual_id: "res-search", class: "missing_effector", description: "Search and discovery strategy is undefined.", blocking: false },
      { residual_id: "res-localization", class: "missing_policy", description: "Multi-language strategy is not decided.", blocking: false },
    ],
  };
}
