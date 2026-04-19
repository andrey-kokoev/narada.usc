# Residual Taxonomy

A residual is a durable record of a blocker, ambiguity, or deferred decision that prevents a construction step from becoming admissible.

## Core Rule

If a draft transformation fails readiness, the blocker must become a residual. It must not remain as informal commentary, implicit assumption, or unrecorded dependency.

## Residual Classes

### 1. Unresolved Principal Decision

A choice only the principal can make. No delegate can resolve it without violating authority boundaries.

- **Blocks execution?** Yes, if the decision governs admissible transformations.
- **Deferrable?** Only with explicit principal consent.
- **Resolution path** Principal makes the decision; record as closure.

### 2. Missing Policy

A rule, constraint, or invariant has not been defined. The construction calculus cannot evaluate admissibility without it.

- **Blocks execution?** Yes, for transformations that depend on the missing policy.
- **Deferrable?** Yes, if the policy can be temporarily substituted with an explicit provisional rule.
- **Resolution path** Authority with policy locus defines the rule; record as closure.

### 3. Missing Effector

No executable path is available for the needed transformation. The intent is expressible but cannot be realized with current tools, skills, or access.

- **Blocks execution?** Yes.
- **Deferrable?** Yes, if an alternative effector can be provisioned or the transformation can be decomposed.
- **Resolution path** Acquire effector, decompose task, or residualize as `out_of_calculus_target`.

### 4. Failed Review

A review found that the evidence did not satisfy the review predicate.

- **Blocks execution?** Yes — rejected work must not integrate.
- **Deferrable?** No. Rework or redesign must happen before integration.
- **Resolution path** Executor addresses findings; work is resubmitted for review.

### 5. Blocked Dependency

A prerequisite task, resource, or decision is not satisfied.

- **Blocks execution?** Yes, for the dependent task.
- **Deferrable?** The blocked task cannot proceed, but other independent tasks can.
- **Resolution path** Complete the dependency; if the dependency is permanently blocked, residualize or declare non-goal.

### 6. Reopened Closure

A previously closed decision must be revisited because new information, constraints, or principal intent has changed.

- **Blocks execution?** Yes, for anything that depended on the now-reopened closure.
- **Deferrable?** No — reopened closures are active decisions again.
- **Resolution path** Re-evaluate with the new context; re-close or change course.

### 7. Out of Calculus Target

The intent cannot be expressed or realized within the current construction calculus. The system, effectors, or representation are insufficient.

- **Blocks execution?** Permanently for this path.
- **Deferrable?** No — this is a terminal classification.
- **Resolution path** Principal must either expand the calculus or abandon the intent.

### 8. Declared Non-Goal

The principal explicitly chooses not to pursue this path. This is a deliberate negative decision.

- **Blocks execution?** Permanently for this path.
- **Deferrable?** No — but the principal may later reverse this declaration.
- **Resolution path** Record the declaration as closure; do not spawn tasks for abandoned paths.

### 9. Decision-Inert Distinction

An ambiguity exists, but no admissible transformation depends on resolving it. The distinction is real but irrelevant to construction.

- **Blocks execution?** No.
- **Deferrable?** N/A — inert distinctions do not need resolution.
- **Resolution path** Mark explicitly as inert; do not create tasks or decision requests for it.

## Residual Lifecycle

```text
encountered -> classified -> recorded -> (resolved | deferred | branch_closed)
```

A residual that is not classified and recorded within the same session becomes hidden arbitrariness — a failure of USC discipline.
