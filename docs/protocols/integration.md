# Integration Protocol

Integration is the act of accepting reviewed construction work into the durable system state. It is distinct from review and from execution.

## Integration Inputs

- Reviewed task
- Review outcome (`accept`, `reject`, `residualize`, `reopen`)
- Review findings
- Integration authority's assessment of systemic impact

## Integration Actions

### Accept

The work is accepted into the durable system state.

**Prerequisites:**
- Review outcome is `accept` (or review authority also holds integration authority and explicitly certifies)
- No unresolved conflicts with integrated work
- Public contracts and invariants are preserved

**Effects:**
- Artifacts are merged/committed to durable truth
- Task status becomes `accepted`
- Closure records are updated
- Downstream tasks may become unblocked

### Reject

The work is rejected and must not integrate.

**Prerequisites:**
- Review outcome is `reject` or integration authority identifies an uncaught defect

**Effects:**
- Task status becomes `rejected`
- Executor must address findings or the task is abandoned
- If abandonment, a residual or declared non-goal must be recorded

### Residualize

The work reveals a new blocker or ambiguity that must become durable.

**Prerequisites:**
- Review outcome is `residualize` or integration authority identifies a systemic blocker

**Effects:**
- Task status becomes `residualized`
- Residual record is created
- New task or decision request is spawned from the residual
- Original work may be partially integrated if the residual is separable

### Reopen

A prior closure must be explicitly reopened before continuing.

**Prerequisites:**
- Review or integration authority identifies that a closed decision is no longer valid

**Effects:**
- Closure record is marked `reopened`
- Dependent tasks may be blocked or re-evaluated
- Principal or semantic authority may need to re-close with new context

## Distinctions

| Concept | What it is | Who does it |
|---------|------------|-------------|
| **Review finding** | Evidence-based assessment against a predicate | Review authority |
| **Integration decision** | Commitment to durable system state | Integration authority |
| **Closure update** | Recording that a decision is now closed | Authority that made the decision |
| **Residual creation** | Durable record of a blocker | Whoever encounters the blocker |

A review finding is **not** an integration decision unless the reviewer also holds integration authority and explicitly declares it. The locus must be explicit.

## Rollback

If integrated work is later discovered to be defective:

1. Do not silently revert. Create a reopening record.
2. Assess whether the defect stems from failed review, failed execution, or changed context.
3. If review failed, review authority must be notified.
4. If execution failed, execution authority must address the rework.
5. Record the rollback as a construction event in durable truth.
