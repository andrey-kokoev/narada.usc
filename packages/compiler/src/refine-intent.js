import { findPackById, detectPack } from "./domain-packs.js";

const builtInDomains = [
  "enterprise_resource_planning",
  "support_helpdesk",
  "customer_relationship_management",
  "e_commerce",
  "content_management",
  "analytics",
  "unknown",
];

function detectBuiltInDomain(intent) {
  const text = intent.toLowerCase();
  if (/erp|enterprise resource|resource planning|inventory|procurement|supply chain/.test(text)) {
    return "enterprise_resource_planning";
  }
  if (/helpdesk|support|ticket|customer service|service desk/.test(text)) {
    return "support_helpdesk";
  }
  if (/crm|customer relationship|sales pipeline|lead management/.test(text)) {
    return "customer_relationship_management";
  }
  if (/e-commerce|shop|store|marketplace|checkout|payment/.test(text)) {
    return "e_commerce";
  }
  if (/blog|cms|content management|publishing/.test(text)) {
    return "content_management";
  }
  if (/analytics|dashboard|metrics|reporting|bi|business intelligence/.test(text)) {
    return "analytics";
  }
  return null;
}

function buildCommonAmbiguities() {
  return [
    { layer: "ontology", description: "What entities, relationships, and boundaries define this system?", governing: true },
    { layer: "dynamics", description: "How do users and processes interact with the system over time?", governing: true },
    { layer: "normativity", description: "What rules, constraints, and compliance requirements apply?", governing: true },
    { layer: "environment", description: "What external systems, integrations, and deployment constraints exist?", governing: true },
    { layer: "stopping", description: "What defines MVP, done, and out-of-scope for this construction?", governing: true },
  ];
}

function buildCommonQuestions() {
  return [
    { question: "What does success look like for this system?", authority: "principal", blocking: true },
    { question: "Who are the primary users and what is the organization size?", authority: "principal", blocking: true },
    { question: "What is the timeline and what constraints (budget, compliance, team) apply?", authority: "principal", blocking: false },
  ];
}

function buildCommonSeedTasks() {
  return [
    { id: "T1", title: "Define system scope and success criteria", authority_locus: "principal", transformation: "Document what the system must do, for whom, and what success looks like.", evidence_requirement: "A written scope document exists and has been reviewed.", review_predicate: "A third party can understand the scope without asking clarifying questions." },
    { id: "T2", title: "Identify constraints and non-goals", authority_locus: "principal", transformation: "Explicitly list budget, timeline, compliance, and out-of-scope items.", evidence_requirement: "Constraints and non-goals are documented.", review_predicate: "No hidden constraints remain that would invalidate the construction plan." },
  ];
}

function buildCommonResiduals() {
  return [
    { residual_id: "res-scope-unresolved", class: "unresolved_principal_decision", description: "System scope and success criteria are not yet defined by the principal.", blocking: true },
    { residual_id: "res-constraints-unknown", class: "missing_policy", description: "Constraints, compliance requirements, and non-goals have not been documented.", blocking: false },
  ];
}

function buildBuiltInAmbiguities(domain) {
  const domainSpecific = {
    enterprise_resource_planning: [
      { layer: "ontology", description: "Build from scratch vs configure existing ERP vs integration layer", governing: true },
      { layer: "ontology", description: "Which modules are required (finance, HR, inventory, manufacturing, CRM)?", governing: true },
      { layer: "dynamics", description: "Batch vs real-time processing requirements", governing: true },
      { layer: "normativity", description: "Accounting standards, tax rules, and audit compliance", governing: true },
      { layer: "environment", description: "Data migration scope from existing systems", governing: true },
      { layer: "environment", description: "Hosting model (self-hosted, cloud SaaS, hybrid)", governing: true },
      { layer: "stopping", description: "MVP module boundary and rollout sequence", governing: true },
    ],
    support_helpdesk: [
      { layer: "ontology", description: "Self-service portal vs agent-only vs hybrid", governing: true },
      { layer: "ontology", description: "Ticket taxonomy and escalation hierarchy", governing: true },
      { layer: "dynamics", description: "SLA definitions and breach handling", governing: true },
      { layer: "environment", description: "Integration with email, chat, phone, or existing CRM", governing: true },
      { layer: "normativity", description: "Privacy and data retention for customer interactions", governing: true },
      { layer: "stopping", description: "Channels supported in MVP", governing: true },
    ],
    customer_relationship_management: [
      { layer: "ontology", description: "Lead/account/contact/opportunity model", governing: true },
      { layer: "dynamics", description: "Sales pipeline stages and automation triggers", governing: true },
      { layer: "environment", description: "Integration with email, calendar, and marketing tools", governing: true },
      { layer: "stopping", description: "MVP sales process coverage", governing: true },
    ],
    e_commerce: [
      { layer: "ontology", description: "Product catalog structure and variant handling", governing: true },
      { layer: "dynamics", description: "Payment flow, fulfillment, and return processing", governing: true },
      { layer: "normativity", description: "PCI-DSS, tax calculation, and consumer protection", governing: true },
      { layer: "stopping", description: "MVP product count and geography", governing: true },
    ],
    content_management: [
      { layer: "ontology", description: "Content types, taxonomy, and editorial workflow", governing: true },
      { layer: "dynamics", description: "Publishing schedule, approval chains, and versioning", governing: true },
      { layer: "stopping", description: "MVP content model and editor features", governing: true },
    ],
    analytics: [
      { layer: "ontology", description: "Data sources, metrics definitions, and dimensions", governing: true },
      { layer: "dynamics", description: "Real-time vs batch reporting and alerting", governing: true },
      { layer: "stopping", description: "MVP dashboards and metric count", governing: true },
    ],
    unknown: [
      { layer: "ontology", description: "The system domain is not recognized; the principal must define what is being built", governing: true },
    ],
  };
  return domainSpecific[domain] || [];
}

function buildBuiltInQuestions(domain) {
  const domainSpecific = {
    enterprise_resource_planning: [
      { question: "Is this a greenfield build, replacement, or integration layer?", authority: "principal", options: ["greenfield", "replacement", "integration"], blocking: true },
      { question: "Which modules are in MVP?", authority: "principal", options: ["finance", "hr", "inventory", "manufacturing", "crm", "procurement"], blocking: true },
      { question: "What existing systems must be migrated or integrated?", authority: "semantic", blocking: true },
      { question: "What accounting standards and compliance requirements apply?", authority: "principal", blocking: false },
      { question: "Who will host and operate the system?", authority: "planning", options: ["self-hosted", "cloud-saas", "hybrid"], blocking: false },
    ],
    support_helpdesk: [
      { question: "What channels must be supported (email, chat, phone, portal)?", authority: "principal", blocking: true },
      { question: "What are the target SLA response and resolution times?", authority: "principal", blocking: false },
      { question: "Must this integrate with an existing CRM or user directory?", authority: "semantic", blocking: false },
    ],
    customer_relationship_management: [
      { question: "What sales stages and automation are required?", authority: "principal", blocking: true },
      { question: "Must this integrate with email, calendar, or marketing tools?", authority: "semantic", blocking: false },
    ],
    e_commerce: [
      { question: "What is the initial product catalog size and geography?", authority: "principal", blocking: true },
      { question: "What payment providers and fulfillment methods are required?", authority: "principal", blocking: true },
    ],
    content_management: [
      { question: "What content types and editorial workflow are required?", authority: "principal", blocking: true },
      { question: "How many editors and what approval chain is needed?", authority: "principal", blocking: false },
    ],
    analytics: [
      { question: "What data sources and metrics are required in MVP?", authority: "principal", blocking: true },
      { question: "Real-time or batch reporting?", authority: "principal", options: ["real-time", "batch", "both"], blocking: false },
    ],
    unknown: [
      { question: "What kind of system are you trying to build?", authority: "principal", blocking: true },
      { question: "What problem should this system solve for its users?", authority: "principal", blocking: true },
      { question: "Are you building from scratch, replacing something, or integrating?", authority: "principal", options: ["greenfield", "replacement", "integration"], blocking: true },
    ],
  };
  return domainSpecific[domain] || [];
}

function buildBuiltInAssumptions(domain) {
  const domainSpecific = {
    enterprise_resource_planning: [
      { assumption: "Multi-tenant or single-tenant deployment", confidence: "low", reversible: true },
      { assumption: "Web-based UI is sufficient for MVP", confidence: "medium", reversible: true },
    ],
    support_helpdesk: [
      { assumption: "Web portal and email are sufficient channels for MVP", confidence: "medium", reversible: true },
    ],
    customer_relationship_management: [
      { assumption: "Web-based UI is sufficient for MVP", confidence: "medium", reversible: true },
    ],
    e_commerce: [
      { assumption: "Standard payment providers (Stripe/PayPal) are acceptable", confidence: "medium", reversible: true },
    ],
    unknown: [
      { assumption: "A web-based system is the intended delivery form", confidence: "low", reversible: true },
    ],
  };
  return domainSpecific[domain] || [];
}

function buildBuiltInSeedTasks(domain) {
  const domainSpecific = {
    enterprise_resource_planning: [
      { id: "T3", title: "Decide build vs configure vs integrate strategy", authority_locus: "principal", transformation: "Choose whether to build custom ERP, configure existing ERP, or build an integration layer.", evidence_requirement: "Decision is documented with rationale and alternatives rejected.", review_predicate: "Decision accounts for total cost of ownership and timeline." },
      { id: "T4", title: "Inventory existing systems and data migration requirements", authority_locus: "semantic", transformation: "List all systems that interact with ERP data and define migration scope.", evidence_requirement: "System inventory and data map exist.", review_predicate: "No critical data source or integration is missing from the inventory." },
      { id: "T5", title: "Define MVP module boundary", authority_locus: "principal", transformation: "Select which ERP modules are in MVP and which are deferred.", evidence_requirement: "Module boundary is documented with rollout sequence.", review_predicate: "MVP is achievable with available resources and timeline." },
    ],
    support_helpdesk: [
      { id: "T3", title: "Define ticket taxonomy and SLA structure", authority_locus: "semantic", transformation: "Document ticket types, priorities, escalation rules, and SLA targets.", evidence_requirement: "Taxonomy and SLA document exist.", review_predicate: "SLA targets are measurable and achievable." },
      { id: "T4", title: "Select channels and integrations for MVP", authority_locus: "principal", transformation: "Decide which channels (email, chat, portal) and integrations are required.", evidence_requirement: "Channel and integration list is documented.", review_predicate: "Selected channels cover the primary user journeys." },
    ],
    unknown: [
      { id: "T3", title: "Clarify system domain and problem statement", authority_locus: "principal", transformation: "Produce a clear statement of what kind of system is needed and what problem it solves.", evidence_requirement: "Domain and problem statement are written and reviewable.", review_predicate: "A reader can identify the system type and user problem without ambiguity." },
    ],
  };
  return domainSpecific[domain] || [];
}

function buildBuiltInResiduals(domain) {
  const domainSpecific = {
    enterprise_resource_planning: [
      { residual_id: "res-erp-strategy", class: "unresolved_principal_decision", description: "Build vs configure vs integrate strategy is unresolved.", blocking: true },
      { residual_id: "res-modules", class: "unresolved_principal_decision", description: "Required ERP modules and MVP boundary are undefined.", blocking: true },
      { residual_id: "res-migration", class: "missing_effector", description: "Data migration approach depends on existing system inventory which is incomplete.", blocking: false },
    ],
    support_helpdesk: [
      { residual_id: "res-channels", class: "unresolved_principal_decision", description: "Support channels for MVP are not selected.", blocking: true },
      { residual_id: "res-sla", class: "missing_policy", description: "SLA definitions are not yet established.", blocking: false },
    ],
    unknown: [
      { residual_id: "res-domain-unknown", class: "out_of_calculus_target", description: "The system domain is too broad to form a construction state. Principal must narrow intent.", blocking: true },
    ],
  };
  return domainSpecific[domain] || [];
}

function buildBuiltInSuggestedClosures(domain) {
  const domainSpecific = {
    enterprise_resource_planning: [
      { decision: "ERP construction will follow a defined module boundary with explicit phased rollout.", rationale: "ERP is too large to build all at once; phased rollout reduces risk.", authority: "principal" },
    ],
    unknown: [
      { decision: "Intent is too broad to proceed; principal must clarify domain and problem before task formation.", rationale: "USC requires explicit intent before construction steps become admissible.", authority: "principal" },
    ],
  };
  return domainSpecific[domain] || [];
}

function refineBuiltIn(intent, domain) {
  return {
    intent,
    detected_domain: domain,
    ambiguities: [...buildCommonAmbiguities(), ...buildBuiltInAmbiguities(domain)],
    questions: [...buildCommonQuestions(), ...buildBuiltInQuestions(domain)],
    assumptions: buildBuiltInAssumptions(domain),
    suggested_closures: buildBuiltInSuggestedClosures(domain),
    seed_tasks: [...buildCommonSeedTasks(), ...buildBuiltInSeedTasks(domain)],
    residuals: [...buildCommonResiduals(), ...buildBuiltInResiduals(domain)],
  };
}

function refinePack(intent, pack) {
  const packResult = pack.refine(intent);
  return {
    intent,
    detected_domain: pack.id,
    ambiguities: [...buildCommonAmbiguities(), ...packResult.ambiguities],
    questions: [...buildCommonQuestions(), ...packResult.questions],
    assumptions: packResult.assumptions,
    suggested_closures: packResult.suggested_closures,
    seed_tasks: [...buildCommonSeedTasks(), ...packResult.seed_tasks],
    residuals: [...buildCommonResiduals(), ...packResult.residuals],
  };
}

function refineIntent(intent, domainHint) {
  // If a domain hint is provided, try built-in first, then packs
  if (domainHint) {
    if (builtInDomains.includes(domainHint)) {
      return refineBuiltIn(intent, domainHint);
    }
    const pack = findPackById(domainHint);
    if (pack) {
      return refinePack(intent, pack);
    }
    // Unknown domain hint: fall through to detection
  }

  // Auto-detect: built-in first, then packs
  const builtIn = detectBuiltInDomain(intent);
  if (builtIn) {
    return refineBuiltIn(intent, builtIn);
  }

  const pack = detectPack(intent);
  if (pack) {
    return refinePack(intent, pack);
  }

  return refineBuiltIn(intent, "unknown");
}

function detectDomain(intent) {
  const builtIn = detectBuiltInDomain(intent);
  if (builtIn) return builtIn;
  const pack = detectPack(intent);
  if (pack) return pack.id;
  return "unknown";
}

export { refineIntent, detectDomain };
