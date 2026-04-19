export function detect(intent) {
  const text = intent.toLowerCase();
  return /\binternal tool\b|\badmin panel\b|\badmin dashboard\b|\bbackoffice\b|\bback.office\b|\boperations tool\b|\binternal app\b/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "User roles and their operational responsibilities", governing: true },
      { layer: "ontology", description: "CRUD surfaces and which entities are managed", governing: true },
      { layer: "dynamics", description: "Approval flows and their triggers and authorities", governing: true },
      { layer: "dynamics", description: "Import and export capabilities and formats", governing: true },
      { layer: "normativity", description: "Audit logs and traceability requirements", governing: true },
      { layer: "normativity", description: "Permissions and RBAC model", governing: true },
      { layer: "environment", description: "Reporting needs and data sources", governing: true },
      { layer: "environment", description: "Source-of-truth boundaries (what this tool owns vs mirrors)", governing: true },
      { layer: "normativity", description: "Operational risk and blast radius of admin actions", governing: true },
      { layer: "stopping", description: "MVP boundary: which surfaces and workflows are in scope", governing: true },
    ],
    questions: [
      { question: "Who are the users and what are their roles?", authority: "principal", blocking: true },
      { question: "What entities and CRUD surfaces are required?", authority: "principal", blocking: true },
      { question: "What actions require approval and who approves?", authority: "principal", blocking: false },
      { question: "What import/export capabilities are needed?", authority: "principal", blocking: false },
      { question: "What audit trail is required?", authority: "principal", blocking: false },
      { question: "What is the source of truth for each entity?", authority: "semantic", blocking: false },
      { question: "What is the blast radius of destructive admin actions?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "The tool is used by authenticated internal users only", confidence: "medium", reversible: true },
      { assumption: "Standard RBAC is sufficient for MVP", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Internal tool construction will treat admin actions as high-risk and require explicit audit logging and approval gates for destructive operations.", rationale: "Internal tools often have broad permissions; audit and approval reduce operational risk.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Define user roles and CRUD matrix", authority_locus: "principal", transformation: "Document roles and which entities each role can create, read, update, delete.", evidence_requirement: "Role-CRUD matrix is documented.", review_predicate: "Every role has defined permissions for every entity." },
      { id: "T4", title: "Map approval flows and authorities", authority_locus: "principal", transformation: "Document which actions need approval, who can approve, and escalation rules.", evidence_requirement: "Approval flow documentation exists.", review_predicate: "Every approval-required action has a defined approver." },
      { id: "T5", title: "Define source-of-truth boundaries", authority_locus: "semantic", transformation: "Document which entities this tool owns and which are mirrored from external systems.", evidence_requirement: "Source-of-truth map exists.", review_predicate: "No entity has ambiguous ownership." },
    ],
    residuals: [
      { residual_id: "res-roles", class: "unresolved_principal_decision", description: "User roles and responsibilities are not defined.", blocking: true },
      { residual_id: "res-crud", class: "unresolved_principal_decision", description: "Required CRUD surfaces are not documented.", blocking: true },
      { residual_id: "res-approval", class: "missing_policy", description: "Approval flows are not defined.", blocking: false },
    ],
  };
}
