export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bworkflow\b|\bautomation\b|trigger.*action|zapier|ifttt|\borchestrat|\bpipeline\b.*autom/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Trigger sources (event, schedule, webhook, manual, external system)", governing: true },
      { layer: "ontology", description: "Action targets (API, database, notification, external system)", governing: true },
      { layer: "dynamics", description: "State and retry semantics (exactly-once, at-least-once, at-most-once)", governing: true },
      { layer: "normativity", description: "Approval requirements before destructive or sensitive actions", governing: true },
      { layer: "normativity", description: "Idempotency and deduplication strategy", governing: true },
      { layer: "environment", description: "Auditability requirements (who triggered what, when, and outcome)", governing: true },
      { layer: "environment", description: "Failure handling (retry, dead letter, alert, manual recovery)", governing: true },
      { layer: "environment", description: "External integration constraints (rate limits, auth, availability)", governing: true },
      { layer: "dynamics", description: "Human override and escalation paths", governing: true },
      { layer: "dynamics", description: "Scheduling and time semantics (timezone, daylight saving, cron)", governing: true },
    ],
    questions: [
      { question: "What are the primary trigger sources?", authority: "principal", options: ["event", "schedule", "webhook", "manual", "external"], blocking: true },
      { question: "What are the primary action targets?", authority: "principal", options: ["api", "database", "notification", "external"], blocking: true },
      { question: "What delivery guarantee is required?", authority: "principal", options: ["exactly-once", "at-least-once", "at-most-once"], blocking: true },
      { question: "Which actions require human approval before execution?", authority: "principal", blocking: false },
      { question: "How should failures be handled (retry, dead letter, alert)?", authority: "semantic", options: ["retry", "dead-letter", "alert", "manual-recovery"], blocking: false },
      { question: "What audit trail is required?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "Workflows are primarily automated with optional human approval gates", confidence: "medium", reversible: true },
      { assumption: "Standard retry with exponential backoff is sufficient for transient failures", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Workflow construction will separate trigger detection, state management, and action execution into distinct layers.", rationale: "Separation enables independent evolution of triggers and actions, and supports retry without re-execution.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Map trigger sources and event schema", authority_locus: "semantic", transformation: "Document all trigger sources, their event shapes, and validation rules.", evidence_requirement: "Trigger inventory and event schema exist.", review_predicate: "Every trigger has a defined schema and source." },
      { id: "T4", title: "Define action targets and integration contracts", authority_locus: "semantic", transformation: "Document action targets, their APIs, auth, and failure modes.", evidence_requirement: "Action target contracts are documented.", review_predicate: "Each action has defined success/failure criteria." },
      { id: "T5", title: "Design state and retry semantics", authority_locus: "principal", transformation: "Choose and document delivery guarantee, state machine, and retry policy.", evidence_requirement: "State machine and retry policy are documented.", review_predicate: "A developer can implement the workflow engine from the document." },
    ],
    residuals: [
      { residual_id: "res-triggers", class: "unresolved_principal_decision", description: "Trigger sources are not defined.", blocking: true },
      { residual_id: "res-actions", class: "unresolved_principal_decision", description: "Action targets are not defined.", blocking: true },
      { residual_id: "res-delivery-guarantee", class: "missing_policy", description: "Delivery guarantee (exactly-once, etc.) is not selected.", blocking: false },
    ],
  };
}
