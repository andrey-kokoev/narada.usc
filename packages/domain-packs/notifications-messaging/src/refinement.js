export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bnotification\b|\bmessaging\b|\bbroadcast\b|\balert\b|\bpush\b|\bsms\b|\bemail\b|communication system|message platform|notify user|send message/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Channels (email, SMS, push, in-app, webhook, chat)", governing: true },
      { layer: "ontology", description: "Message types and templates (transactional, promotional, alert, digest)", governing: true },
      { layer: "ontology", description: "Audience and recipient model (user, segment, broadcast, dynamic)", governing: true },
      { layer: "normativity", description: "Consent and preferences (opt-in, opt-out, channel preferences, frequency)", governing: true },
      { layer: "dynamics", description: "Delivery guarantees (at-most-once, at-least-once, exactly-once)", governing: true },
      { layer: "dynamics", description: "Retries and failure handling (dead letter, backoff, manual retry)", governing: true },
      { layer: "dynamics", description: "Scheduling and throttling (immediate, scheduled, rate-limited, batch)", governing: false },
      { layer: "dynamics", description: "Personalization and dynamic content (variables, localization, A/B)", governing: false },
      { layer: "normativity", description: "Audit and logging (send log, open/click tracking, retention)", governing: false },
      { layer: "environment", description: "Provider integrations (SMTP, Twilio, Firebase, OneSignal, custom)", governing: false },
      { layer: "normativity", description: "Compliance and opt-out rules (CAN-SPAM, GDPR, TCPA)", governing: true },
      { layer: "environment", description: "Analytics and deliverability (bounce rates, spam scores, engagement)", governing: false },
      { layer: "stopping", description: "MVP boundary: which channels, message types, and guarantees are in scope", governing: true },
    ],
    questions: [
      { question: "What channels are required? (email, SMS, push, in-app, webhook, chat)", authority: "principal", blocking: true },
      { question: "What message types are in scope? (transactional, promotional, alert, digest)", authority: "principal", blocking: true },
      { question: "What delivery guarantee is required? (at-most-once, at-least-once, exactly-once)", authority: "semantic", options: ["at-most-once", "at-least-once", "exactly-once"], blocking: true },
      { question: "How is consent managed? (explicit opt-in, implicit, granular per-channel)", authority: "principal", options: ["explicit-opt-in", "implicit", "granular-per-channel"], blocking: false },
      { question: "Is scheduling or throttling required? (immediate only, scheduled, rate-limited)", authority: "principal", blocking: false },
      { question: "What compliance rules apply? (CAN-SPAM, GDPR, TCPA, none)", authority: "principal", blocking: false },
      { question: "Are open/click tracking or engagement analytics required?", authority: "principal", options: ["yes", "no"], blocking: false },
      { question: "What provider integrations are preferred?", authority: "semantic", blocking: false },
    ],
    assumptions: [
      { assumption: "Messages are sent to known users or segments with valid contact information", confidence: "high", reversible: true },
      { assumption: "No single channel is assumed as primary unless explicitly specified", confidence: "medium", reversible: true },
      { assumption: "Transactional messages have higher delivery priority than promotional", confidence: "medium", reversible: true },
      { assumption: "Compliance requirements must be explicitly declared", confidence: "high", reversible: true },
    ],
    suggested_closures: [
      { decision: "Notifications and messaging construction will support multi-channel delivery with explicit delivery guarantees and consent management.", rationale: "Channel, guarantee, and consent choices determine the architecture, provider selection, and compliance surface.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T1", title: "Define channels and message type taxonomy", authority_locus: "principal", transformation: "Document supported channels and message categories.", evidence_requirement: "Channel and message taxonomy is documented.", review_predicate: "Any message can be classified by channel and type." },
      { id: "T2", title: "Define delivery guarantee and retry strategy", authority_locus: "semantic", transformation: "Document delivery semantics, retry policy, and dead-letter handling.", evidence_requirement: "Delivery model is documented with failure handling.", review_predicate: "A developer can implement retry and dead-letter logic from the document." },
      { id: "T3", title: "Define consent and preference model", authority_locus: "principal", transformation: "Document opt-in, opt-out, and channel preference rules.", evidence_requirement: "Consent model is documented with user flows.", review_predicate: "A user can manage preferences without contacting support." },
      { id: "T4", title: "Define compliance and audit requirements", authority_locus: "principal", transformation: "Document applicable regulations and audit retention rules.", evidence_requirement: "Compliance checklist and audit log requirements are documented.", review_predicate: "An auditor can verify compliance from logs and documentation." },
    ],
    residuals: [
      { residual_id: "res-channels", class: "unresolved_principal_decision", description: "Required channels and message types are not defined.", blocking: true },
      { residual_id: "res-delivery-guarantee", class: "unresolved_principal_decision", description: "Delivery guarantee is not selected.", blocking: true },
      { residual_id: "res-consent", class: "missing_policy", description: "Consent and preference model is not documented.", blocking: false },
      { residual_id: "res-compliance", class: "missing_policy", description: "Compliance rules are not specified.", blocking: false },
      { residual_id: "res-providers", class: "missing_effector", description: "Provider integrations are not selected.", blocking: false },
    ],
  };
}
