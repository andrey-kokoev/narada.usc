export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bbilling\b|\bsubscription\b|\binvoice\b|\bpayment\b|\bplan\b|\btier\b|\bpricing\b|\busage\b.*\bmeter|\bdunning\b|\brecurring\b/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Pricing model (flat, tiered, usage-based, per-seat, hybrid)", governing: true },
      { layer: "ontology", description: "Plan/package structure and entitlements mapping", governing: true },
      { layer: "dynamics", description: "Subscription lifecycle (trial, active, paused, cancelled, expired)", governing: true },
      { layer: "dynamics", description: "Trials, promotions, discounts, and coupon semantics", governing: true },
      { layer: "dynamics", description: "Usage metering, aggregation, and billing period alignment", governing: true },
      { layer: "normativity", description: "Invoices, receipts, and credit note requirements", governing: true },
      { layer: "normativity", description: "Tax/VAT/GST calculation, collection, and remittance obligations", governing: true },
      { layer: "environment", description: "Payment methods, processors, and failure handling", governing: true },
      { layer: "dynamics", description: "Dunning and retry policy for failed payments", governing: true },
      { layer: "normativity", description: "Refunds, credits, and adjustment authority", governing: true },
      { layer: "normativity", description: "Revenue recognition constraints and reporting", governing: true },
      { layer: "environment", description: "Integrations with accounting, CRM, product catalog, and usage sources", governing: true },
    ],
    questions: [
      { question: "What pricing model is required?", authority: "principal", options: ["flat", "tiered", "usage-based", "per-seat", "hybrid"], blocking: true },
      { question: "What is the plan/package structure and how are entitlements mapped?", authority: "principal", blocking: true },
      { question: "What subscription states and transitions are required?", authority: "principal", blocking: true },
      { question: "Are trials, promotions, or discounts required?", authority: "principal", blocking: false },
      { question: "What usage metrics must be metered and how are they aggregated?", authority: "principal", blocking: false },
      { question: "What tax obligations (VAT/GST/sales tax) apply and where?", authority: "principal", blocking: false },
      { question: "What payment methods must be supported and who processes them?", authority: "principal", blocking: false },
      { question: "What is the dunning and retry policy for failed payments?", authority: "principal", blocking: false },
      { question: "Who has authority to issue refunds and credits?", authority: "principal", blocking: false },
      { question: "What revenue recognition rules and reporting are required?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "Standard invoice/receipt format is acceptable for MVP", confidence: "medium", reversible: true },
      { assumption: "Payment processing will be handled by an external provider", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Billing construction will separate pricing, subscription state, usage metering, and payment processing into independent layers.", rationale: "Separation enables evolution of pricing without rewriting payment logic, and supports multiple payment providers.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Define pricing model and plan structure", authority_locus: "principal", transformation: "Document pricing tiers, entitlements, and upgrade/downgrade rules.", evidence_requirement: "Pricing model is documented with plan comparison.", review_predicate: "A customer can understand what each plan includes and costs." },
      { id: "T4", title: "Map subscription lifecycle and state machine", authority_locus: "principal", transformation: "Define all subscription states, transitions, triggers, and side effects.", evidence_requirement: "State machine diagram and transition rules exist.", review_predicate: "Every state transition has defined preconditions and postconditions." },
      { id: "T5", title: "Define usage metering and aggregation rules", authority_locus: "principal", transformation: "Document what is metered, how it is aggregated, and how it maps to billing.", evidence_requirement: "Metering rules and aggregation logic are documented.", review_predicate: "Usage can be calculated from the rules without ambiguity." },
    ],
    residuals: [
      { residual_id: "res-pricing-model", class: "unresolved_principal_decision", description: "Pricing model is not selected.", blocking: true },
      { residual_id: "res-plan-structure", class: "unresolved_principal_decision", description: "Plan/package structure is undefined.", blocking: true },
      { residual_id: "res-subscription-lifecycle", class: "missing_policy", description: "Subscription lifecycle states and transitions are not defined.", blocking: false },
      { residual_id: "res-tax", class: "missing_policy", description: "Tax obligations and calculation rules are not documented.", blocking: false },
      { residual_id: "res-revenue-recognition", class: "missing_policy", description: "Revenue recognition constraints are not defined.", blocking: false },
    ],
  };
}
