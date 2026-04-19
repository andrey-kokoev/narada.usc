export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bproject management\b|\bproject-management\b|\btask management\b|\bportfolio\b|\bwork tracking\b|project tracker|task tracker|delivery coordination/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Task, project, and work item ontology (types, hierarchies, custom fields)", governing: true },
      { layer: "ontology", description: "Hierarchy and dependencies (subtasks, milestones, blocked-by, relates-to)", governing: true },
      { layer: "dynamics", description: "Statuses and workflows (custom states, approvals, done criteria)", governing: true },
      { layer: "dynamics", description: "Assignment and ownership model (individual, team, role-based, workload-aware)", governing: true },
      { layer: "dynamics", description: "Planning cadence (sprint, kanban, milestone, waterfall, hybrid)", governing: true },
      { layer: "dynamics", description: "Estimates and capacity (time, story points, t-shirt sizing, none)", governing: false },
      { layer: "normativity", description: "Permissions and visibility (who can see/edit what, private projects)", governing: true },
      { layer: "dynamics", description: "Notifications and subscriptions (mentions, status changes, due dates)", governing: false },
      { layer: "environment", description: "Reporting and dashboards (burndown, velocity, portfolio health)", governing: false },
      { layer: "environment", description: "Integrations with code repos, docs, chat, or calendars", governing: false },
      { layer: "dynamics", description: "Review and approval gates (who signs off, what triggers escalation)", governing: false },
      { layer: "stopping", description: "MVP methodology boundary (which planning model and features are in scope)", governing: true },
    ],
    questions: [
      { question: "What is the primary planning model? (sprint, kanban, milestone, waterfall, hybrid)", authority: "principal", options: ["sprint", "kanban", "milestone", "waterfall", "hybrid"], blocking: true },
      { question: "What entities exist? (tasks, projects, epics, portfolios, milestones)", authority: "principal", blocking: true },
      { question: "How are items assigned? (individual, team, role, auto-assigned)", authority: "principal", options: ["individual", "team", "role", "auto-assigned"], blocking: true },
      { question: "What defines done? (status, approval, checklist, review)", authority: "principal", blocking: false },
      { question: "Are estimates required? (time, points, t-shirt, none)", authority: "principal", options: ["time", "points", "t-shirt", "none"], blocking: false },
      { question: "What permission model is needed? (open, project-private, org-private, role-based)", authority: "principal", blocking: false },
      { question: "Are code repo, docs, or chat integrations required?", authority: "principal", blocking: false },
      { question: "What reporting is required at MVP?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "Projects and tasks are the primary work units", confidence: "high", reversible: true },
      { assumption: "Users are identified and belong to an organization or team", confidence: "high", reversible: true },
      { assumption: "Agile/scrum semantics are not assumed by default", confidence: "medium", reversible: true },
      { assumption: "Time tracking is not required unless explicitly requested", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Project management construction will use an explicit work-item ontology with a chosen planning model and assignment strategy.", rationale: "The ontology and planning model determine the entire user experience, notification surface, and reporting capabilities.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T1", title: "Define work item ontology and hierarchy", authority_locus: "principal", transformation: "Document entities, relationships, and hierarchy rules.", evidence_requirement: "Entity model is documented with examples.", review_predicate: "A user can create any work item without ambiguity about its type or parent." },
      { id: "T2", title: "Define planning model and workflow states", authority_locus: "principal", transformation: "Choose and document the planning cadence and status workflow.", evidence_requirement: "Workflow states and transitions are documented.", review_predicate: "Any work item can be classified by status and next permissible action." },
      { id: "T3", title: "Define assignment and ownership model", authority_locus: "principal", transformation: "Document how work is assigned and who can reassign.", evidence_requirement: "Assignment rules are documented.", review_predicate: "Every work item has a clear owner at all times." },
      { id: "T4", title: "Define permissions and visibility model", authority_locus: "principal", transformation: "Document who can see, edit, and administer projects and tasks.", evidence_requirement: "Permission matrix is documented.", review_predicate: "A new user can understand what they can access without trial and error." },
    ],
    residuals: [
      { residual_id: "res-work-item-ontology", class: "unresolved_principal_decision", description: "Work item ontology and hierarchy are not defined.", blocking: true },
      { residual_id: "res-planning-model", class: "unresolved_principal_decision", description: "Planning model is not selected.", blocking: true },
      { residual_id: "res-assignment-model", class: "unresolved_principal_decision", description: "Assignment and ownership model is undefined.", blocking: true },
      { residual_id: "res-permissions", class: "missing_policy", description: "Permissions and visibility model is not documented.", blocking: false },
      { residual_id: "res-integrations", class: "missing_policy", description: "Code/docs/chat integrations are not specified.", blocking: false },
    ],
  };
}
