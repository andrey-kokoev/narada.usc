# Construction Session Template

A construction session records a contiguous block of USC activity.

## Metadata

| Field | Value |
|-------|-------|
| `session_id` | `sess_<timestamp-or-uuid>` |
| `started_at` | ISO 8601 timestamp |
| `principal` | Who holds principal authority for this session |
| `authority_locus` | Which authority loci are active in this session |

## Principal Intent

State the principal intent that opened this session.

> Example: "Add a public API documentation site to the open-source library."

## Decision Context

What matters right now? What constraints, deadlines, or risks shape this session?

## Ambiguity Localization

List decision-relevant arbitrariness encountered in this session.

For each item:

- **Arbitrariness**: What is unclear or could be chosen differently?
- **Governing**: Does this affect admissible transformations?
- **Options**: What choices are available?
- **Authority**: Who decides?
- **Resolution**: Closed, deferred, or residual?

## Decisions Made

Record explicit closures from this session.

| Decision | Authority | Rationale |
|----------|-----------|-----------|
| | | |

## Task Graph Changes

What tasks were created, claimed, executed, reviewed, or residualized?

## Execution Evidence

What artifacts were produced? Link or describe.

## Review Outcomes

What reviews were performed and what were their findings?

## Residuals

What blockers remain? What must become new tasks or principal decisions?

## Session Closure

- [ ] All hidden arbitrariness has been localized or assigned
- [ ] All decisions have explicit authority and rationale
- [ ] All residuals are durable (task, decision request, or declared non-goal)
- [ ] Evidence is captured and reviewable

---

*This template is Markdown-first. For machine validation, translate to `session.schema.json`.*
