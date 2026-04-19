export function detect(intent) {
  const text = intent.toLowerCase();
  const score =
    (/\bcms\b/.test(text) ? 3 : 0) +
    (/\bpublishing\b/.test(text) ? 3 : 0) +
    (/\bcontent management\b/.test(text) ? 3 : 0) +
    (/\beditorial\b/.test(text) ? 2 : 0) +
    (/\bdocumentation\b/.test(text) ? 2 : 0) +
    (/\bblog\b/.test(text) ? 2 : 0) +
    (/\bwiki\b/.test(text) ? 2 : 0) +
    (/\bknowledge base\b/.test(text) ? 1 : 0);
  return score > 0 ? score : false;
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Content types and taxonomy (articles, pages, media, structured data) and how they relate", governing: true },
      { layer: "ontology", description: "Editorial roles (author, editor, reviewer, publisher, admin) and their permissions", governing: true },
      { layer: "dynamics", description: "Draft/review/publish workflow stages and who can move content between them", governing: true },
      { layer: "dynamics", description: "Versioning and history model (linear, branching, snapshots, rollback)", governing: true },
      { layer: "environment", description: "Media and asset handling (upload, storage, transforms, CDN, limits)", governing: true },
      { layer: "dynamics", description: "Scheduling model (publish at, expire at, embargo, recurring)", governing: true },
      { layer: "environment", description: "Localization and multi-language strategy (separate trees, field-level, translation workflow)", governing: true },
      { layer: "normativity", description: "Permissions model (role-based, attribute-based, content-level, site-level)", governing: true },
      { layer: "environment", description: "Search and discovery (full-text, faceted, tagged, recommendations)", governing: true },
      { layer: "environment", description: "SEO and distribution (metadata, sitemaps, OG tags, syndication, RSS)", governing: true },
      { layer: "environment", description: "Import/export capabilities and supported formats", governing: true },
      { layer: "stopping", description: "MVP content model boundary — what content types are in scope for first release", governing: true },
    ],
    questions: [
      { question: "What content types must be supported in MVP?", authority: "principal", blocking: true },
      { question: "What editorial workflow stages are required (e.g., draft → review → publish)?", authority: "principal", blocking: true },
      { question: "Who can publish content, and who must review before publish?", authority: "principal", blocking: true },
      { question: "Is multi-language content required, and if so, what is the strategy?", authority: "principal", blocking: false },
      { question: "What media types and size limits must be supported?", authority: "principal", blocking: false },
      { question: "Is scheduled publishing required?", authority: "principal", blocking: false },
      { question: "What search and discovery features are required?", authority: "principal", blocking: false },
      { question: "What SEO and distribution requirements apply?", authority: "semantic", blocking: false },
      { question: "What import/export formats must be supported?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "Articles and pages are the core MVP content types", confidence: "medium", reversible: true },
      { assumption: "A simple draft → review → publish workflow is acceptable for MVP", confidence: "medium", reversible: true },
      { assumption: "Role-based permissions at the content-type level are sufficient initially", confidence: "medium", reversible: true },
      { assumption: "Single-language content is acceptable for MVP", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "CMS construction will start with articles and pages under a draft → review → publish workflow with role-based permissions.", rationale: "A focused content model and conservative workflow reduce initial complexity while preserving principal control over published content.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T1", title: "Define content types and taxonomy", authority_locus: "principal", transformation: "Document all content types, their fields, relationships, and taxonomy for MVP.", evidence_requirement: "Content type specification document exists.", review_predicate: "Every content type has defined fields, relationships, and an owner." },
      { id: "T2", title: "Define editorial roles and permissions", authority_locus: "principal", transformation: "Document editorial roles, what each can do, and how permissions are enforced.", evidence_requirement: "Role and permission matrix exists.", review_predicate: "No role has unexplained permissions; publish permission is explicitly granted." },
      { id: "T3", title: "Define content workflow stages", authority_locus: "principal", transformation: "Document workflow stages, transitions, and who can trigger each transition.", evidence_requirement: "Workflow state diagram and transition rules exist.", review_predicate: "Every stage has a clear exit criteria and authorized actor." },
      { id: "T4", title: "Define versioning and history policy", authority_locus: "principal", transformation: "Document how versions are created, stored, and how rollback works.", evidence_requirement: "Versioning policy document exists.", review_predicate: "A principal can recover any prior published version." },
      { id: "T5", title: "Define media handling strategy", authority_locus: "semantic", transformation: "Document upload limits, transforms, storage, and delivery approach.", evidence_requirement: "Media handling specification exists.", review_predicate: "Supported media types, size limits, and delivery method are documented." },
      { id: "T6", title: "Define MVP content model boundary", authority_locus: "principal", transformation: "Explicitly list content types and features in MVP and what is out of scope.", evidence_requirement: "MVP scope document exists with explicit inclusions and exclusions.", review_predicate: "Scope is achievable and every excluded item is consciously deferred." },
    ],
    residuals: [
      { residual_id: "res-content-types", class: "unresolved_principal_decision", description: "Content types for MVP are not defined.", blocking: true },
      { residual_id: "res-workflow", class: "unresolved_principal_decision", description: "Editorial workflow stages are not decided.", blocking: true },
      { residual_id: "res-roles", class: "unresolved_principal_decision", description: "Editorial roles and permissions are not established.", blocking: true },
      { residual_id: "res-versioning", class: "missing_policy", description: "Versioning and history model is not defined.", blocking: false },
      { residual_id: "res-media", class: "missing_effector", description: "Media handling strategy is not documented.", blocking: false },
      { residual_id: "res-localization", class: "unresolved_principal_decision", description: "Multi-language strategy is not decided.", blocking: false },
    ],
  };
}
