# Universal Systems Constructor

A Universal Systems Constructor is a constructive control process that turns principal intent into admissible system transformation by progressively eliminating, exposing, or assigning decision-relevant arbitrariness before execution.

Its universality is relative to a construction calculus. A USC can construct or evolve any system whose construction can be represented in that calculus and whose required transformations are executable by available effectors under expressible review predicates.

## Core Type

```text
USC_C : (S, I, K) -> (S', E) | R
```

| Symbol | Meaning |
|--------|---------|
| `S` | current system state |
| `I` | principal intent |
| `K` | construction context: constraints, policy, authority boundaries, effectors, prior closure |
| `S'` | transformed system state |
| `E` | evidence of admissible construction |
| `R` | residuals: unresolved arbitrariness, failed review, missing effectors, or blocked dependencies |

## Construction State

```text
CState = (S, I, J, A, K, G, T, E, P)
```

| Component | Meaning |
|-----------|---------|
| `S` | current system |
| `I` | principal intent |
| `J` | decision context |
| `A` | unresolved decision-relevant arbitrariness |
| `K` | closed constraints, policy, and invariants |
| `G` | task/dependency graph |
| `T` | executable transformations |
| `E` | captured evidence |
| `P` | review predicates |

## Admissibility

A construction step is admissible only if:

```text
authority(step) is explicit
requirements(step) are satisfied
transform(step) is executable
evidence(step) is capturable
review(step) is expressible
residual_arbitrariness(step) = empty
```

## Central Invariant

USC preserves articulated difference across time, authority, execution, and review.
