export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bfield service\b|\bfield ops\b|\bmobile workforce\b|technician dispatch|work order|site visit|field technician|service call/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Service types and categorization (preventive, corrective, installation, inspection)", governing: true },
      { layer: "ontology", description: "Customers, sites, and assets ontology (hierarchy, ownership, locations)", governing: true },
      { layer: "dynamics", description: "Work order lifecycle (create, schedule, dispatch, execute, close, invoice)", governing: true },
      { layer: "dynamics", description: "Dispatch and scheduling model (manual, automated, territory-based, skill-based)", governing: true },
      { layer: "ontology", description: "Technician skills, certifications, and availability model", governing: true },
      { layer: "environment", description: "Mobile and offline needs (forms, signatures, photo capture, sync strategy)", governing: true },
      { layer: "dynamics", description: "Parts and inventory integration (truck stock, warehouse, ordering)", governing: false },
      { layer: "environment", description: "Photos, signatures, and forms capture requirements", governing: false },
      { layer: "normativity", description: "SLA and priority model (response time, resolution time, escalation)", governing: true },
      { layer: "dynamics", description: "Billing and invoicing integration (time, materials, flat rate, contract)", governing: false },
      { layer: "environment", description: "Routing and geography constraints (territories, travel time, GPS)", governing: false },
      { layer: "environment", description: "Integrations with CRM, ERP, or inventory systems", governing: false },
      { layer: "stopping", description: "MVP boundary: which service types, geographies, and integrations are in scope", governing: true },
    ],
    questions: [
      { question: "What types of service work are in scope? (preventive, corrective, installation, inspection, etc.)", authority: "principal", blocking: true },
      { question: "How are technicians assigned to work? (manual dispatch, automated scheduling, territory-based, skill-matching)", authority: "principal", options: ["manual-dispatch", "automated-scheduling", "territory-based", "skill-matching"], blocking: true },
      { question: "Do technicians need mobile access with offline capability?", authority: "principal", options: ["online-only", "offline-capable"], blocking: true },
      { question: "What defines work order completion? (signature, photo, form, parts used, customer approval)", authority: "principal", blocking: false },
      { question: "Are parts/inventory tracked per technician or centralized?", authority: "semantic", blocking: false },
      { question: "What SLA or priority tiers apply?", authority: "principal", blocking: false },
      { question: "Is billing time-and-materials, flat rate, or contract-based?", authority: "principal", options: ["time-and-materials", "flat-rate", "contract-based", "mixed"], blocking: false },
      { question: "What CRM or ERP integrations are required?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "Work orders are the primary unit of field work", confidence: "high", reversible: true },
      { assumption: "Technicians are known users with assigned credentials", confidence: "high", reversible: true },
      { assumption: "Real-time dispatch is not required unless explicitly specified", confidence: "medium", reversible: true },
      { assumption: "A dedicated mobile app is not required unless explicitly specified", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Field service construction will use a work-order-centric model with explicit dispatch and completion boundaries.", rationale: "Work orders are the universal coordination point for field operations and determine scheduling, billing, and reporting.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T1", title: "Define service types and work order ontology", authority_locus: "principal", transformation: "Document all service types, work order states, and completion criteria.", evidence_requirement: "Service taxonomy and state machine are documented.", review_predicate: "A technician can understand what work to perform from the work order alone." },
      { id: "T2", title: "Define dispatch and scheduling model", authority_locus: "principal", transformation: "Choose and document how work is assigned to technicians.", evidence_requirement: "Dispatch rules and scheduling constraints are documented.", review_predicate: "A dispatcher can assign work without ambiguity." },
      { id: "T3", title: "Define technician mobility and offline strategy", authority_locus: "principal", transformation: "Decide mobile form factor and offline synchronization approach.", evidence_requirement: "Mobility strategy is documented with offline handling.", review_predicate: "Technicians can complete work without network if required." },
      { id: "T4", title: "Define SLA and priority framework", authority_locus: "principal", transformation: "Document response times, resolution targets, and escalation rules.", evidence_requirement: "SLA matrix exists with measurable targets.", review_predicate: "Any work order can be classified by priority and SLA." },
    ],
    residuals: [
      { residual_id: "res-service-types", class: "unresolved_principal_decision", description: "Service types and work order ontology are not defined.", blocking: true },
      { residual_id: "res-dispatch-model", class: "unresolved_principal_decision", description: "Dispatch and scheduling model is not selected.", blocking: true },
      { residual_id: "res-mobile-strategy", class: "unresolved_principal_decision", description: "Mobile and offline strategy is undecided.", blocking: true },
      { residual_id: "res-sla", class: "missing_policy", description: "SLA and priority framework is not documented.", blocking: false },
      { residual_id: "res-integrations", class: "missing_policy", description: "CRM/ERP/inventory integrations are not specified.", blocking: false },
    ],
  };
}
