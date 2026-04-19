export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bsaas\b|software as a service|multi.tenant|subscription|billing|onboarding|b2b|b2c/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Target customer/user segments (B2B, B2C, vertical, horizontal)", governing: true },
      { layer: "ontology", description: "Tenant model (shared schema, isolated schema, hybrid)", governing: true },
      { layer: "ontology", description: "Auth and identity model ( SSO, password, magic link, MFA)", governing: true },
      { layer: "dynamics", description: "Billing/subscription model (freemium, tiered, usage-based, custom)", governing: true },
      { layer: "dynamics", description: "Onboarding and activation flow (self-serve, sales-led, hybrid)", governing: true },
      { layer: "normativity", description: "Admin roles and permission model (RBAC, ABAC, custom)", governing: true },
      { layer: "normativity", description: "Data isolation requirements between tenants", governing: true },
      { layer: "environment", description: "Observability and support model (self-service, dedicated support, hybrid)", governing: true },
      { layer: "environment", description: "Compliance and security requirements (SOC2, GDPR, HIPAA, etc.)", governing: true },
      { layer: "stopping", description: "MVP boundary: which tenants, features, and geographies are in scope", governing: true },
    ],
    questions: [
      { question: "Who is the target customer? B2B, B2C, or vertical-specific?", authority: "principal", blocking: true },
      { question: "What tenant isolation model is required?", authority: "principal", options: ["shared-schema", "isolated-schema", "hybrid"], blocking: true },
      { question: "What billing model is expected?", authority: "principal", options: ["freemium", "tiered", "usage-based", "custom"], blocking: true },
      { question: "What compliance requirements apply?", authority: "principal", blocking: false },
      { question: "Is onboarding self-serve, sales-led, or hybrid?", authority: "principal", options: ["self-serve", "sales-led", "hybrid"], blocking: false },
      { question: "What auth methods must be supported?", authority: "semantic", options: ["password", "sso", "magic-link", "mfa"], blocking: false },
    ],
    assumptions: [
      { assumption: "Web-based application is the primary delivery form", confidence: "medium", reversible: true },
      { assumption: "Standard cloud hosting is acceptable", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "SaaS construction will follow a tenant-aware architecture with explicit isolation boundaries.", rationale: "Tenant isolation is foundational to SaaS and affects every layer of the system.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Define tenant model and isolation strategy", authority_locus: "principal", transformation: "Choose and document the tenant isolation model and its implications.", evidence_requirement: "Tenant model decision is documented with trade-offs.", review_predicate: "A developer can implement tenant isolation from the document alone." },
      { id: "T4", title: "Define customer segments and onboarding flow", authority_locus: "principal", transformation: "Document target segments and how each segment is onboarded.", evidence_requirement: "Segment and onboarding documentation exists.", review_predicate: "Each segment has a defined path from signup to value." },
      { id: "T5", title: "Define billing and subscription model", authority_locus: "principal", transformation: "Document pricing tiers, billing events, and subscription lifecycle.", evidence_requirement: "Billing model is documented with state machine.", review_predicate: "Billing logic covers signup, upgrade, downgrade, and cancellation." },
    ],
    residuals: [
      { residual_id: "res-tenant-model", class: "unresolved_principal_decision", description: "Tenant isolation model is not selected.", blocking: true },
      { residual_id: "res-billing", class: "unresolved_principal_decision", description: "Billing/subscription model is undefined.", blocking: true },
      { residual_id: "res-compliance", class: "missing_policy", description: "Compliance requirements are not documented.", blocking: false },
    ],
  };
}
