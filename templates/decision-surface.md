# Decision Surface Template

A decision surface captures all active choices that shape a construction state.

## Purpose

Before executing, expose every decision that could have been made differently and confirm that each is either:

- explicitly closed,
- assigned to a known authority, or
- declared decision-inert.

## System Context

What system and scope does this decision surface apply to?

## Active Decisions

| # | Decision | Options | Status | Authority | Rationale |
|---|----------|---------|--------|-----------|-----------|
| 1 | | | closed / open / deferred / inert | | |
| 2 | | | | | |
| 3 | | | | | |

## Closed Decisions

Reference closure records:

- `cls_...`
- `cls_...`

## Open Decisions

What must still be decided? What blocks each?

## Decision-Inert Distinctions

What ambiguity exists but does not affect admissible transformations?

> Example: "Whether the docs use British or American spelling is inert because the doc generator handles localization."

## Readiness Check

- [ ] Every open decision has an assigned authority
- [ ] No hidden arbitrariness remains
- [ ] All closed decisions reference durable closure records
- [ ] All inert distinctions are explicitly marked

---

*For machine validation, use `decision-surface.schema.json`.*
