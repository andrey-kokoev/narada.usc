# Construction State Protocol

A USC construction state records enough structure to continue construction without hidden policy or lost closure.

## Shape

```text
CState = (S, I, J, A, K, G, T, E, P)
```

| Component | Meaning |
|-----------|---------|
| `S` | current system |
| `I` | principal intent |
| `J` | decision context |
| `A` | unresolved arbitrariness |
| `K` | closed policy, constraints, invariants |
| `G` | task/dependency graph |
| `T` | executable transformations |
| `E` | evidence |
| `P` | review predicates |

## Ready State

A state is construction-ready when each draft transformation has:

- explicit authority locus
- satisfied dependencies
- executable effect
- evidence path
- review predicate
- no hidden decision-relevant arbitrariness

## Residualization

If a draft transformation fails readiness, the blocker must become one of:

- principal decision request
- policy rule request
- bounded residual task
- declared non-goal
- decision-inert distinction
