# Question and Escalation Protocol

> **USC Constructor Protocol** — applies to all task-graph work in USC-governed repos unless explicitly overridden.

This protocol defines when a worker agent should stop and ask for help instead of making an arbitrary architecture, product, safety, authority, or private-data decision.

It is a constructor-level primitive: workers executing a task graph need a protocol for unresolved arbitrariness.

## When To Escalate

Escalate before proceeding if the task requires a choice that is not already determined by code, docs, contracts, or task text.

### Mandatory Escalation Triggers

| Trigger | Description |
|---------|-------------|
| **Authority boundary ambiguity** | It is unclear which component is allowed to mutate or decide. |
| **Semantic conflict** | Task requirements contradict canonical docs, code invariants, or another active task. |
| **Live external mutation** | Sending email, mutating external state, deleting data, changing production systems, or calling external APIs is needed but not explicitly authorized. |
| **Secret / private-data ambiguity** | Credentials, customer data, or operational data might be committed, logged, or exposed. |
| **Product decision** | Multiple user-visible behaviors are plausible and no canonical choice exists. |
| **Broad scope expansion** | Completing the task would require work outside the stated task boundary. |
| **Verification ambiguity** | Tests fail for reasons that appear systemic, unrelated, or safety-relevant. |
| **Dishonest completion risk** | The worker cannot satisfy the Definition of Done without overclaiming. |
| **Irreversible migration or data change** | Schema or data migration cannot be safely reversed or replayed without a decision. |

## When Not To Escalate

Do not escalate for ordinary implementation details when the local design is implied by existing patterns.

Examples of non-escalation:

- Choosing a file-local helper name.
- Adding a focused unit test for new behavior.
- Following an existing interface shape.
- Fixing a clear type error.
- Updating task checkboxes after verified completion.

## Escalation Format

Record the escalation in the original task file under:

```markdown
## Escalation Needed

### Question

What specifically is unknown or arbitrary?

### Why This Blocks

Why can the worker not proceed without a decision?

### Options Considered

- A: ...
- B: ...

### Recommendation

What does the worker recommend, and why?

### Current State

What has been done so far? What would change after the decision?
```

Keep it concise and concrete. Do not create a separate escalation file unless explicitly asked.

## Pause Rule

After recording `## Escalation Needed`, stop before taking the disputed action.

Allowed before stopping:

- Leave code unchanged.
- Commit no changes.
- Record exact blocker and current state.
- Suggest the smallest decision needed.

Forbidden before the escalation is answered:

- Making the semantic/product/authority choice silently.
- Marking the task complete.
- Creating a derivative result/status file.
- Performing live external mutation.

## Decision Recording

When the principal or architect answers, record the decision in the original task file:

```markdown
## Decision

...
```

Then proceed according to that decision. If the decision updates a reusable contract, canonical doc, or system invariant, update the relevant canonical artifact as part of the task or create a follow-up task.

## Governance Feedback (Not Escalation)

If the task is **not blocked** but the worker notices friction in the governing system itself (ambiguous contracts, repeated criteria, verification policy gaps, task-DAG blocking, or a better rule), do not escalate. Instead:

1. Complete the task.
2. Append feedback to the appropriate governance feedback channel (e.g., `.ai/feedback/governance.md` or equivalent) using the format documented there.

Escalation is for blockers. Governance feedback is for post-task improvement signals.

## Architect Interaction

If an architect agent is available, ask the architect first. If not, ask the principal (user).

The answer should be treated as task-local unless it clearly updates a reusable contract, canonical doc, or system invariant.

## Relationship to USC Authority

| USC Authority Class | Escalation Relevance |
|---------------------|---------------------|
| `derive` | May escalate if derivation rule is ambiguous. |
| `propose` | May escalate if proposal boundary is unclear. |
| `claim` | Runtime claim authority; escalation belongs to downstream runtime. |
| `execute` | Runtime execution authority; escalation belongs to downstream runtime. |
| `resolve` | Runtime resolution authority; escalation belongs to downstream runtime. |
| `confirm` | Runtime confirmation authority; escalation belongs to downstream runtime. |

USC itself (constructor/deriver) does not execute tasks. This protocol governs worker behavior during task execution in downstream runtimes that consume USC artifacts.
