export function detect(intent) {
  const text = intent.toLowerCase();
  return /\bai\b.*\bagent\b|\bagent\b.*\boperat|\bautonomous\b.*\bagent|\bcopilot\b|\bagentic\b|\bllm\b.*\boperat/.test(text);
}

export function refine(intent) {
  return {
    ambiguities: [
      { layer: "ontology", description: "Charter and role definition (what the agent is authorized to do)", governing: true },
      { layer: "ontology", description: "Allowed tools and APIs the agent may invoke", governing: true },
      { layer: "normativity", description: "Authority boundaries (what the agent can decide vs escalate)", governing: true },
      { layer: "environment", description: "Memory and knowledge sources (context window, RAG, long-term memory)", governing: true },
      { layer: "normativity", description: "Review posture (pre-approval, post-review, no review)", governing: true },
      { layer: "dynamics", description: "Escalation paths (when and how the agent hands off to humans)", governing: true },
      { layer: "normativity", description: "Human approval requirements for external execution or communication", governing: true },
      { layer: "normativity", description: "Safety constraints (content filtering, rate limits, sandboxing)", governing: true },
      { layer: "environment", description: "Audit and logging requirements for agent actions", governing: true },
      { layer: "stopping", description: "Evaluation criteria (how to know the agent is performing correctly)", governing: true },
    ],
    questions: [
      { question: "What is the agent's charter? What is it allowed and not allowed to do?", authority: "principal", blocking: true },
      { question: "What tools or APIs can the agent invoke?", authority: "principal", blocking: true },
      { question: "What decisions require human approval before execution?", authority: "principal", blocking: true },
      { question: "What is the review posture (pre-approval, post-review, no review)?", authority: "principal", options: ["pre-approval", "post-review", "no-review"], blocking: false },
      { question: "How does the agent access knowledge and context?", authority: "semantic", options: ["context-window", "rag", "long-term-memory", "hybrid"], blocking: false },
      { question: "What are the escalation rules?", authority: "principal", blocking: false },
      { question: "What safety constraints apply?", authority: "principal", blocking: false },
    ],
    assumptions: [
      { assumption: "The agent operates within a defined sandbox and cannot act outside its charter", confidence: "low", reversible: true },
      { assumption: "Human approval is required for external-facing actions by default", confidence: "medium", reversible: true },
    ],
    suggested_closures: [
      { decision: "Agent construction will start with a strict charter and pre-approval model, relaxing only after evaluation proves safety.", rationale: "Agents with external authority are high-risk; conservative starting posture prevents harm.", authority: "principal" },
    ],
    seed_tasks: [
      { id: "T3", title: "Define agent charter and authority boundaries", authority_locus: "principal", transformation: "Document what the agent can and cannot do, and who can change the charter.", evidence_requirement: "Charter document exists with explicit boundaries.", review_predicate: "A reader can determine whether any proposed action is within charter." },
      { id: "T4", title: "Inventory allowed tools and APIs", authority_locus: "semantic", transformation: "List all tools the agent may invoke, their auth, and failure modes.", evidence_requirement: "Tool inventory with auth and failure modes exists.", review_predicate: "No tool is available to the agent that is not in the inventory." },
      { id: "T5", title: "Define human approval and escalation matrix", authority_locus: "principal", transformation: "Document which actions need approval, who can approve, and escalation rules.", evidence_requirement: "Approval matrix is documented.", review_predicate: "Every action has a defined approval requirement." },
    ],
    residuals: [
      { residual_id: "res-charter", class: "unresolved_principal_decision", description: "Agent charter and authority boundaries are undefined.", blocking: true },
      { residual_id: "res-tools", class: "unresolved_principal_decision", description: "Allowed tools and APIs are not inventoried.", blocking: true },
      { residual_id: "res-approval", class: "missing_policy", description: "Human approval requirements are not defined.", blocking: true },
    ],
  };
}
