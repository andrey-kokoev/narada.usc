export function detect(intent) {
  const text = intent.toLowerCase();
  const score =
    (/\berp\b/.test(text) ? 3 : 0) +
    (/enterprise resource/.test(text) ? 3 : 0) +
    (/resource planning/.test(text) ? 2 : 0) +
    (/\binventory\b|\bprocurement\b|\bsupply chain\b/.test(text) ? 1 : 0);
  return score > 0 ? score : false;
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Build from scratch vs configure existing ERP vs build integration layer", governing: true },
      { layer: "ontology", description: "Organization size, structure, and operating units (subsidiaries, branches, departments)", governing: true },
      { layer: "ontology", description: "User roles and role hierarchy (admin, accountant, warehouse, sales, hr, auditor)", governing: true },
      { layer: "ontology", description: "Modules required in MVP — options include finance, inventory, procurement, sales, HR, manufacturing, reporting; none are chosen by default", governing: true },
      { layer: "dynamics", description: "Batch vs real-time processing for transactions, reporting, and integrations", governing: true },
      { layer: "dynamics", description: "Multi-currency, multi-language, and multi-entity consolidation requirements", governing: true },
      { layer: "normativity", description: "Accounting standards (GAAP, IFRS, tax rules) and audit trail requirements", governing: true },
      { layer: "normativity", description: "Compliance and regulatory requirements (SOX, GDPR, industry-specific)", governing: true },
      { layer: "environment", description: "Data migration scope, source systems, and transformation complexity", governing: true },
      { layer: "environment", description: "Integrations with external systems (banking, e-commerce, CRM, payroll, tax authority)", governing: true },
      { layer: "environment", description: "Security and authentication model (SSO, MFA, RBAC, field-level permissions)", governing: true },
      { layer: "environment", description: "Hosting and deployment model (self-hosted, cloud SaaS, hybrid, on-premise)", governing: true },
      { layer: "stopping", description: "Success criteria, MVP boundary, rollout sequence, and explicit out-of-scope items", governing: true },
    ],
    questions: [
      { question: "Is this a greenfield build, replacement, or integration layer?", authority: "principal", options: ["greenfield", "replacement", "integration"], blocking: true },
      { question: "What is the organization size and structure (users, entities, locations)?", authority: "principal", blocking: true },
      { question: "Which modules are in MVP?", authority: "principal", options: ["finance", "inventory", "procurement", "sales", "hr", "manufacturing", "reporting"], blocking: true },
      { question: "What existing systems must be migrated or integrated?", authority: "semantic", blocking: true },
      { question: "What accounting standards and compliance requirements apply?", authority: "principal", blocking: false },
      { question: "Who will host and operate the system?", authority: "planning", options: ["self-hosted", "cloud-saas", "hybrid", "on-premise"], blocking: false },
      { question: "What user roles and permission granularity are required?", authority: "principal", blocking: false },
      { question: "What authentication and security model is required?", authority: "semantic", options: ["password", "sso", "mfa", "rbac", "field-level"], blocking: false },
      { question: "What is the data migration volume and timeline?", authority: "semantic", blocking: false },
    ],
    assumptions: [
      { assumption: "Web-based UI is sufficient for MVP", confidence: "medium", reversible: true },
      { assumption: "Standard chart of accounts structure is acceptable", confidence: "medium", reversible: true },
      { assumption: "Single primary currency with optional multi-currency support", confidence: "low", reversible: true },
    ],
    suggested_closures: [
      { decision: "ERP construction will follow a defined module boundary with explicit phased rollout.", rationale: "ERP is too large to build all at once; phased rollout reduces risk and preserves decision authority at each stage.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Define ERP scope and module boundary", authority_locus: "principal", transformation: "Select which ERP modules are in MVP and which are deferred, with rationale.", evidence_requirement: "Module boundary is documented with rollout sequence and out-of-scope items.", review_predicate: "MVP is achievable with available resources and timeline; no hidden scope creep." },
      { id: "T4", title: "Decide build vs configure vs integrate strategy", authority_locus: "principal", transformation: "Choose whether to build custom ERP, configure existing ERP, or build an integration layer.", evidence_requirement: "Decision is documented with rationale and alternatives rejected.", review_predicate: "Decision accounts for total cost of ownership, timeline, and team capabilities." },
      { id: "T5", title: "Inventory existing systems and data migration needs", authority_locus: "semantic", transformation: "List all systems that interact with ERP data and define migration scope, volume, and complexity.", evidence_requirement: "System inventory and data map exist with owner contacts.", review_predicate: "No critical data source or integration is missing from the inventory." },
      { id: "T6", title: "Define finance and accounting compliance constraints", authority_locus: "principal", transformation: "Document accounting standards, tax rules, audit requirements, and reporting obligations.", evidence_requirement: "Compliance constraints are written and reviewable by a finance expert.", review_predicate: "Constraints cover all jurisdictions and reporting periods." },
      { id: "T7", title: "Define user roles and permission model", authority_locus: "principal", transformation: "Document roles, hierarchy, and what each role can read, create, modify, and approve.", evidence_requirement: "Role matrix exists with sample users mapped to roles.", review_predicate: "Every business function has a role; no sensitive action is unassigned." },
    ],
    residuals: [
      { residual_id: "res-erp-strategy", class: "unresolved_principal_decision", description: "Build vs configure vs integrate strategy is unresolved.", blocking: true },
      { residual_id: "res-modules", class: "unresolved_principal_decision", description: "Required ERP modules and MVP boundary are undefined.", blocking: true },
      { residual_id: "res-migration", class: "missing_effector", description: "Data migration approach depends on existing system inventory which is incomplete.", blocking: false },
      { residual_id: "res-compliance", class: "missing_policy", description: "Accounting and compliance requirements are not yet documented.", blocking: false },
      { residual_id: "res-hosting", class: "unresolved_principal_decision", description: "Hosting and deployment model is not selected.", blocking: false },
    ],
  };
}
