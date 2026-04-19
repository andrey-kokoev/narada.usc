export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bhealthcare\b|\bhealth care\b|\bmedical\b|\bpatient\b|appointment|clinic|provider|referral|ehr|emr|scheduling|health ops/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Patient or client identity model (unique identifier, household, guardian)", governing: true },
      { layer: "dynamics", description: "Appointments, referrals, and care episodes workflow", governing: true },
      { layer: "ontology", description: "Provider and staff roles (physician, nurse, admin, scheduler, billing)", governing: true },
      { layer: "dynamics", description: "Scheduling and reminders model (self-booking, staff-booked, walk-in, recurring)", governing: true },
      { layer: "environment", description: "Records and documents management (consents, intake forms, results, referrals)", governing: true },
      { layer: "normativity", description: "Consent and privacy requirements (patient consent, data use agreements)", governing: true },
      { layer: "normativity", description: "Compliance framework (HIPAA, state regulations, institutional policy)", governing: true },
      { layer: "dynamics", description: "Billing and insurance integration if applicable", governing: false },
      { layer: "ontology", description: "Clinical vs administrative boundary (what is in scope)", governing: true },
      { layer: "environment", description: "Integrations with EHR/EMR, labs, or imaging systems", governing: false },
      { layer: "normativity", description: "Audit trail requirements (who accessed what, when)", governing: false },
      { layer: "stopping", description: "MVP workflow boundary: which care processes and integrations are in scope", governing: true },
    ],
    questions: [
      { question: "Who is the primary user? (patient, provider, staff, administrator)", authority: "principal", blocking: true },
      { question: "What care workflows are in scope? (appointments, referrals, intake, reminders, records)", authority: "principal", blocking: true },
      { question: "How are appointments scheduled? (patient self-service, staff-only, walk-in, mixed)", authority: "principal", options: ["patient-self-service", "staff-only", "walk-in", "mixed"], blocking: true },
      { question: "What compliance framework applies? (HIPAA, state, institutional, none)", authority: "principal", blocking: false },
      { question: "What is the clinical vs administrative boundary?", authority: "principal", blocking: true },
      { question: "Are EHR/EMR or lab integrations required?", authority: "principal", blocking: false },
      { question: "What consent and privacy model is required?", authority: "principal", blocking: false },
      { question: "Is billing or insurance coordination in scope?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "The system coordinates care operations, not clinical decision-making", confidence: "high", reversible: true },
      { assumption: "Patient identity is managed within the system or via an existing identity provider", confidence: "medium", reversible: true },
      { assumption: "HIPAA compliance is not assumed unless explicitly stated", confidence: "medium", reversible: true },
      { assumption: "Clinical decision support is out of scope unless explicitly requested", confidence: "high", reversible: true },
    ],
    suggested_closures: [
      { decision: "Healthcare operations construction will focus on administrative and coordination workflows with an explicit clinical boundary.", rationale: "Clinical scope must be deliberately bounded to avoid unauthorized medical decision support and compliance exposure.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T1", title: "Define patient or client identity model", authority_locus: "principal", transformation: "Document how patients are identified, linked to households, and managed.", evidence_requirement: "Identity model is documented with edge cases.", review_predicate: "A staff member can look up a patient unambiguously." },
      { id: "T2", title: "Define appointment and scheduling workflow", authority_locus: "principal", transformation: "Document appointment states, scheduling rules, and cancellation policy.", evidence_requirement: "Scheduling workflow is documented with state machine.", review_predicate: "A patient can book and a provider can manage appointments without ambiguity." },
      { id: "T3", title: "Define clinical vs administrative boundary", authority_locus: "principal", transformation: "Explicitly list what is in scope and what requires clinical authority.", evidence_requirement: "Boundary document is signed off by principal.", review_predicate: "No clinical decision logic is implied by the system design." },
      { id: "T4", title: "Define compliance and consent framework", authority_locus: "principal", transformation: "Document applicable regulations, consent flows, and data handling rules.", evidence_requirement: "Compliance checklist and consent flow are documented.", review_predicate: "An auditor can verify compliance from the documentation alone." },
    ],
    residuals: [
      { residual_id: "res-patient-identity", class: "unresolved_principal_decision", description: "Patient or client identity model is not defined.", blocking: true },
      { residual_id: "res-scheduling-model", class: "unresolved_principal_decision", description: "Scheduling model is not selected.", blocking: true },
      { residual_id: "res-clinical-boundary", class: "unresolved_principal_decision", description: "Clinical vs administrative boundary is not defined.", blocking: true },
      { residual_id: "res-compliance", class: "missing_policy", description: "Compliance and consent framework is not documented.", blocking: false },
      { residual_id: "res-integrations", class: "missing_policy", description: "EHR/EMR/lab integrations are not specified.", blocking: false },
    ],
  };
}
