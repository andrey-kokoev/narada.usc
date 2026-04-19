export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bcompliance\b|\baudit\b|\bcontrol\b|\bevidence\b|\bframework\b|\bgovernance\b|\bpolicy\b.*\bmanag|\brisk\b.*\bmanage|\bregulatory/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Compliance frameworks and standards in scope", governing: true },
      { layer: "ontology", description: "Controls and evidence model (control library, evidence types, mappings)", governing: true },
      { layer: "environment", description: "Evidence collection sources and automation level", governing: true },
      { layer: "dynamics", description: "Review and approval workflows for controls and evidence", governing: true },
      { layer: "normativity", description: "Retention policy for evidence and audit records", governing: true },
      { layer: "normativity", description: "Audit trails and immutability requirements", governing: true },
      { layer: "normativity", description: "Access controls and segregation of duties", governing: true },
      { layer: "dynamics", description: "Exceptions, risk acceptance, and deviation tracking", governing: true },
      { layer: "environment", description: "Reporting and export requirements for auditors and regulators", governing: true },
      { layer: "ontology", description: "Ownership, attestation, and accountability model", governing: true },
      { layer: "dynamics", description: "Monitoring cadence (continuous, periodic, event-driven)", governing: true },
      { layer: "stopping", description: "Scope boundary: which systems, teams, and geographies are in scope", governing: true },
    ],
    questions: [
      { question: "What compliance frameworks and standards are in scope?", authority: "principal", blocking: true },
      { question: "What is the controls and evidence model?", authority: "principal", blocking: true },
      { question: "What are the evidence collection sources and automation level?", authority: "principal", blocking: false },
      { question: "What review and approval workflows are required?", authority: "principal", blocking: false },
      { question: "What is the retention policy for evidence and audit records?", authority: "principal", blocking: false },
      { question: "What access controls and segregation of duties are required?", authority: "principal", blocking: false },
      { question: "How are exceptions and risk acceptance tracked?", authority: "principal", blocking: false },
      { question: "What reporting and export requirements do auditors/regulators need?", authority: "principal", blocking: false },
      { question: "Who owns attestation and what is the accountability model?", authority: "principal", blocking: false },
      { question: "What is the monitoring cadence?", authority: "principal", options: ["continuous", "periodic", "event-driven", "hybrid"], blocking: false },
      { question: "What is the scope boundary for compliance coverage?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "Evidence will be collected from existing systems and processes where possible", confidence: "medium", reversible: true },
      { assumption: "Standard audit trail and immutability patterns are sufficient for MVP", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Compliance construction will treat controls, evidence, and audit trails as independent layers with explicit ownership.", rationale: "Separation ensures controls can be updated without invalidating historical evidence, and supports multiple frameworks.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Define compliance frameworks and control library", authority_locus: "principal", transformation: "List frameworks, map controls, and define evidence requirements per control.", evidence_requirement: "Control library with framework mappings exists.", review_predicate: "Every control has defined evidence requirements and a mapped framework clause." },
      { id: "T4", title: "Map evidence sources and collection methods", authority_locus: "semantic", transformation: "Document where evidence comes from, how it is collected, and automation level.", evidence_requirement: "Evidence source inventory exists.", review_predicate: "Every control's evidence has a traceable source and collection method." },
      { id: "T5", title: "Define review workflows and accountability model", authority_locus: "principal", transformation: "Document who reviews evidence, how often, and who attests to control effectiveness.", evidence_requirement: "Review workflow and accountability model are documented.", review_predicate: "Every control has a defined reviewer and attestation owner." },
    ],
    residuals: [
      { residual_id: "res-frameworks", class: "unresolved_principal_decision", description: "Compliance frameworks are not selected.", blocking: true },
      { residual_id: "res-controls", class: "unresolved_principal_decision", description: "Controls and evidence model are undefined.", blocking: true },
      { residual_id: "res-retention", class: "missing_policy", description: "Retention policy is not defined.", blocking: false },
      { residual_id: "res-scope-boundary", class: "unresolved_principal_decision", description: "Compliance scope boundary is not defined.", blocking: false },
      { residual_id: "res-monitoring-cadence", class: "missing_policy", description: "Monitoring cadence is not selected.", blocking: false },
    ],
  };
}
