# Review Template

A review compares execution evidence against a review predicate.

## Metadata

| Field | Value |
|-------|-------|
| `review_id` | `rev_<task-id>_<timestamp>` |
| `task_id` | Which task is being reviewed? |
| `reviewed_by` | Who holds review authority? |
| `reviewed_at` | ISO 8601 timestamp |

## Task Statement

Restate the task's intended transformation.

## Evidence Inspected

List all evidence examined.

| Evidence | Location | Relevance |
|----------|----------|-----------|
| | | |

## Predicate Applied

Restate the review predicate.

## Findings

What was discovered? Be specific.

### Satisfied

- Finding 1
- Finding 2

### Not Satisfied / Concerns

- Concern 1
- Concern 2

## Outcome

Select one:

- [ ] **accept** — evidence satisfies predicate; integration may proceed
- [ ] **reject** — evidence fails predicate; work must not integrate
- [ ] **residualize** — new blocker or ambiguity must become durable task/decision
- [ ] **reopen** — prior closure must be explicitly reopened before continuing

## Integration Note

If review authority is separate from integration authority, state the recommendation and leave integration to the integration authority.

---

*For machine validation, use `review.schema.json`.*
