# Closure Record Template

A closure record documents an explicit decision that eliminates decision-relevant arbitrariness.

## Metadata

| Field | Value |
|-------|-------|
| `closure_id` | `cls_<timestamp-or-uuid>` |
| `closed_at` | ISO 8601 timestamp |
| `authority_locus` | Who decided? |

## Decision Surface

What was decided?

> Be concrete. "Use OpenAPI 3.1" is better than "Use a standard format."

## Alternatives Considered

| Alternative | Why Rejected | Authority |
|-------------|--------------|-----------|
| | | |

## Rationale

Why was this choice made? What constraints, values, or evidence informed it?

## Reversibility

- [ ] **Reversible** — Can be reopened if new information arises
- [ ] **Sunk** — Creates dependencies that make reversal expensive
- [ ] **Permanent** — A fundamental commitment (e.g., public API contract)

## Reopening Conditions

Under what conditions should this closure be revisited?

> Example: "If the doc generator we chose drops maintenance for > 12 months."

## Consequences

What other decisions or tasks does this closure create or eliminate?

---

*For machine validation, use `closure-record.schema.json`.*
