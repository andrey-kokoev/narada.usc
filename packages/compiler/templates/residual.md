# Residual Template

A residual is durable record of a blocker, ambiguity, or deferred decision that prevents a construction step from becoming admissible.

## Metadata

| Field | Value |
|-------|-------|
| `residual_id` | `res_<source-task-id>_<ordinal>` |
| `source_task_id` | Which task produced this residual? |
| `created_at` | ISO 8601 timestamp |

## Residual Class

Select one:

- [ ] **unresolved_principal_decision** — A choice only the principal can make
- [ ] **missing_policy** — A rule or constraint has not been defined
- [ ] **missing_effector** — No executable path is available for the needed transformation
- [ ] **failed_review** — Review rejected the work; rework or redesign is needed
- [ ] **blocked_dependency** — A prerequisite task or resource is not satisfied
- [ ] **reopened_closure** — A previously closed decision must be revisited
- [ ] **out_of_calculus_target** — The intent cannot be expressed in the current construction calculus
- [ ] **declared_non_goal** — The principal explicitly chooses not to pursue this path
- [ ] **decision_inert_distinction** — The ambiguity exists but no admissible transformation depends on resolving it

## Description

What exactly is blocked? What would unblock it?

## Blocking Status

- [ ] **Blocks execution** — No dependent work can proceed until resolved
- [ ] **Deferrable** — Can be postponed without halting the construction line
- [ ] **Closes branch** — This path is permanently abandoned (usually `declared_non_goal` or `out_of_calculus_target`)

## Resolution Path

What must happen to clear this residual?

| Action | Authority | Estimated Effort |
|--------|-----------|------------------|
| | | |

## Derived Tasks

If this residual becomes a new task, link it here.

- `task_id`: 

---

*For machine validation, use `residual.schema.json`.*
