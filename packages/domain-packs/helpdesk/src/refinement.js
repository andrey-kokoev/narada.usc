export function detect(intent) {
  const text = intent.toLowerCase();
  const score =
    (/\bhelpdesk\b/.test(text) ? 3 : 0) +
    (/\bsupport\b/.test(text) ? 2 : 0) +
    (/\bticket\b/.test(text) ? 2 : 0) +
    (/customer service|service desk/.test(text) ? 2 : 0);
  return score > 0 ? score : false;
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Support channels (email, chat, phone, portal, social) and which are in MVP", governing: true },
      { layer: "ontology", description: "Mailbox and channel ownership model (dedicated, shared, existing)", governing: true },
      { layer: "dynamics", description: "SLA definitions, priority rules, and breach handling workflow", governing: true },
      { layer: "dynamics", description: "Assignment and routing logic (round-robin, skill-based, load-balanced, manual)", governing: true },
      { layer: "normativity", description: "Response posture: observe-only, draft-only, review-required, or autonomous — not assumed autonomous by default", governing: true },
      { layer: "normativity", description: "Knowledge base sources and how they are consumed (docs, wikis, past tickets, product DB)", governing: true },
      { layer: "normativity", description: "Escalation paths and criteria (time-based, complexity, customer tier, sentiment)", governing: true },
      { layer: "environment", description: "Integration with CRM, project management, or user directory systems", governing: true },
      { layer: "environment", description: "Audit, logging, and data retention requirements for customer interactions", governing: true },
      { layer: "stopping", description: "Channels supported in MVP, success criteria, and explicit out-of-scope channels or features", governing: true },
      { layer: "stopping", description: "Reporting and metrics requirements (response time, resolution rate, CSAT, backlog)", governing: true },
    ],
    questions: [
      { question: "What support channels must be supported in MVP?", authority: "principal", options: ["email", "chat", "phone", "portal", "social"], blocking: true },
      { question: "What are the target SLA response and resolution times?", authority: "principal", blocking: false },
      { question: "What response posture is required?", authority: "principal", options: ["observe-only", "draft-only", "review-required", "autonomous"], blocking: true },
      { question: "Must this integrate with an existing CRM or user directory?", authority: "semantic", blocking: false },
      { question: "What knowledge sources should be available to responders?", authority: "principal", blocking: false },
      { question: "What are the escalation rules and paths?", authority: "principal", blocking: false },
      { question: "What audit and data retention requirements apply?", authority: "principal", blocking: false },
      { question: "What reporting metrics are required?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "Web portal and email are sufficient channels for MVP", confidence: "medium", reversible: true },
      { assumption: "A review-required or draft-only posture is acceptable initially", confidence: "medium", reversible: true },
      { assumption: "Standard ticket taxonomy (open, pending, resolved, closed) is acceptable", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Helpdesk construction will start with email and portal channels under a review-required posture.", rationale: "Starting with fewer channels and a conservative posture reduces risk and preserves principal authority over customer-facing communication.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Define support channels and ownership", authority_locus: "principal", transformation: "Document which channels are in MVP, who owns each mailbox/endpoint, and how handoffs work.", evidence_requirement: "Channel and ownership matrix exists.", review_predicate: "Every channel has an owner and a backup; no channel is orphaned." },
      { id: "T4", title: "Define SLA and priority policy", authority_locus: "principal", transformation: "Document response time targets, priority levels, and what happens when SLA is breached.", evidence_requirement: "SLA and priority policy document exists with measurable targets.", review_predicate: "SLA targets are achievable given team size and channel mix." },
      { id: "T5", title: "Define response posture and approval rules", authority_locus: "principal", transformation: "Select posture (observe-only → autonomous) and define who can approve escalation to a more autonomous mode.", evidence_requirement: "Posture decision and approval workflow are documented.", review_predicate: "A principal can understand and enforce the posture without ambiguity." },
      { id: "T6", title: "Define knowledge source bindings", authority_locus: "semantic", transformation: "List knowledge sources, how they are accessed, and how freshness is maintained.", evidence_requirement: "Knowledge source inventory and access method documentation exist.", review_predicate: "Every common ticket type can be answered from documented sources." },
      { id: "T7", title: "Define escalation and handoff rules", authority_locus: "principal", transformation: "Document when and how tickets escalate, who receives escalations, and what closure criteria apply.", evidence_requirement: "Escalation matrix and closure criteria are documented.", review_predicate: "No ticket type lacks an escalation path; criteria are objective." },
    ],
    residuals: [
      { residual_id: "res-channels", class: "unresolved_principal_decision", description: "Support channels for MVP are not selected.", blocking: true },
      { residual_id: "res-posture", class: "unresolved_principal_decision", description: "Response posture is not decided.", blocking: true },
      { residual_id: "res-sla", class: "missing_policy", description: "SLA definitions are not yet established.", review_predicate: "SLA targets are achievable given team size and channel mix." },
      { residual_id: "res-knowledge", class: "missing_effector", description: "Knowledge source bindings are not defined.", blocking: false },
      { residual_id: "res-escalation", class: "missing_policy", description: "Escalation paths and criteria are undocumented.", blocking: false },
    ],
  };
}
