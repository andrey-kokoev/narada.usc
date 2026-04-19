export function detect(intent) {
  const text = intent.toLowerCase();
  const score =
    (/\blearning management\b/.test(text) ? 3 : 0) +
    (/\blms\b/.test(text) ? 3 : 0) +
    (/\btraining\b/.test(text) ? 2 : 0) +
    (/\bcourse\b/.test(text) ? 2 : 0) +
    (/\be-learning\b/.test(text) ? 2 : 0) +
    (/\beducation\b/.test(text) ? 2 : 0) +
    (/\bcertification\b/.test(text) ? 2 : 0) +
    (/\bassessment\b/.test(text) ? 1 : 0) +
    (/\bquiz\b/.test(text) ? 1 : 0);
  return score > 0 ? score : false;
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Learner, instructor, and administrator roles and their permissions", governing: true },
      { layer: "ontology", description: "Course and content model (modules, lessons, resources, prerequisites, paths)", governing: true },
      { layer: "dynamics", description: "Enrollment model (self-enroll, admin-assign, cohort-based, invitation-only)", governing: true },
      { layer: "dynamics", description: "Progress tracking (completion criteria, time spent, milestones, certificates)", governing: true },
      { layer: "normativity", description: "Assessment and quiz model (types, scoring, attempts, proctoring, feedback)", governing: true },
      { layer: "environment", description: "Certificates and completion records (template, verification, expiration, revocation)", governing: true },
      { layer: "environment", description: "Payments or internal training (free, paid, subscription, reimbursement)", governing: true },
      { layer: "dynamics", description: "Content authoring tools and formats (SCORM, video, text, interactive, external)", governing: true },
      { layer: "dynamics", description: "Notification model (reminders, deadlines, achievements, nudges)", governing: true },
      { layer: "environment", description: "Reporting and analytics (learner progress, instructor dashboard, admin reports)", governing: true },
      { layer: "environment", description: "Compliance and training records (mandatory, recurring, audit trail, regulatory)", governing: true },
      { layer: "environment", description: "Integrations with identity, HR, SSO, or external content providers", governing: true },
    ],
    questions: [
      { question: "What roles must be supported (learner, instructor, admin, and any others)?", authority: "principal", blocking: true },
      { question: "How are learners enrolled (self-enroll, assigned, cohort-based)?", authority: "principal", blocking: true },
      { question: "What content formats must be supported in MVP?", authority: "principal", blocking: true },
      { question: "Are assessments and quizzes required, and what types?", authority: "principal", blocking: false },
      { question: "Are certificates or completion records required?", authority: "principal", blocking: false },
      { question: "Is this paid training or internal/free?", authority: "principal", blocking: false },
      { question: "What reporting and analytics are required?", authority: "principal", blocking: false },
      { question: "Are there compliance or regulatory training requirements?", authority: "principal", blocking: false },
      { question: "Must this integrate with an existing identity or HR system?", authority: "semantic", blocking: false },
    ],
    assumptions: [
      { assumption: "Self-enrollment with admin oversight is acceptable for MVP", confidence: "medium", reversible: true },
      { assumption: "Video and text-based lessons are the core MVP content formats", confidence: "medium", reversible: true },
      { assumption: "Simple quiz-based assessments are sufficient for MVP", confidence: "medium", reversible: true },
      { assumption: "Internal/free training model is acceptable initially", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Learning management construction will start with self-enrollment, video/text lessons, and simple quizzes under an internal training model.", rationale: "A focused content model and conservative enrollment approach reduce risk while preserving principal control over course access and content.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T1", title: "Define roles and permissions", authority_locus: "principal", transformation: "Document learner, instructor, and admin roles with their permissions.", evidence_requirement: "Role and permission matrix exists.", review_predicate: "Every role has defined permissions; no role has unexplained access." },
      { id: "T2", title: "Define course and content model", authority_locus: "principal", transformation: "Document course structure, content types, prerequisites, and completion criteria.", evidence_requirement: "Course content model specification exists.", review_predicate: "Every content type has a defined structure and completion rule." },
      { id: "T3", title: "Define enrollment and cohort policy", authority_locus: "principal", transformation: "Document how learners enroll, how cohorts are formed, and how access is managed.", evidence_requirement: "Enrollment policy document exists.", review_predicate: "Every enrollment path has an owner and a criteria; no learner is orphaned." },
      { id: "T4", title: "Define assessment model", authority_locus: "principal", transformation: "Document assessment types, scoring rules, attempt limits, and feedback model.", evidence_requirement: "Assessment model specification exists.", review_predicate: "Every assessment type has scoring rules and a clear pass/fail criteria." },
      { id: "T5", title: "Define progress and completion tracking", authority_locus: "principal", transformation: "Document how progress is measured, what triggers completion, and how certificates are issued.", evidence_requirement: "Progress tracking and completion policy exists.", review_predicate: "Completion criteria are objective and measurable." },
      { id: "T6", title: "Define compliance and reporting requirements", authority_locus: "principal", transformation: "Document regulatory requirements, audit needs, and required reports.", evidence_requirement: "Compliance and reporting specification exists.", review_predicate: "Every regulatory requirement maps to a report or audit trail." },
    ],
    residuals: [
      { residual_id: "res-roles", class: "unresolved_principal_decision", description: "Learner/instructor/admin roles are not defined.", blocking: true },
      { residual_id: "res-enrollment", class: "unresolved_principal_decision", description: "Enrollment model is not decided.", blocking: true },
      { residual_id: "res-content", class: "unresolved_principal_decision", description: "Course content model is not defined.", blocking: true },
      { residual_id: "res-assessment", class: "missing_policy", description: "Assessment model is not established.", blocking: false },
      { residual_id: "res-certificates", class: "missing_policy", description: "Certificate and completion record policy is undefined.", blocking: false },
      { residual_id: "res-payments", class: "unresolved_principal_decision", description: "Payment model is not decided.", blocking: false },
      { residual_id: "res-compliance", class: "missing_policy", description: "Compliance and training record requirements are undocumented.", blocking: false },
    ],
  };
}
