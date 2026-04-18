# Full-Cycle Example: Add Public API Documentation to widget-lib

This example demonstrates one complete USC construction cycle on a sanitized, domain-neutral problem.

## The System

`widget-lib` is an open-source library that provides composable UI widgets. It has a public API but no documentation site. The principal wants to fix this.

## The Cycle

| Step | File | What happens |
|------|------|--------------|
| 1 | [`01-intent.md`](01-intent.md) | Principal states intent |
| 2 | [`02-ambiguity-localization.md`](02-ambiguity-localization.md) | Semantic authority localizes ambiguity |
| 3 | [`03-decisions.md`](03-decisions.md) | Explicit decisions and closures |
| 4 | [`04-task-graph.json`](04-task-graph.json) | Planning authority creates task graph |
| 5 | [`05-claim-and-execution.md`](05-claim-and-execution.md) | Execution authority claims and executes a task |
| 6 | [`06-review.md`](06-review.md) | Review authority evaluates evidence |
| 7 | [`07-outcome.md`](07-outcome.md) | Integration authority accepts; one residual remains |
| — | [`construction-state.json`](construction-state.json) | Durable construction state after the cycle |

## How to Read This

Each file corresponds to a phase in the USC pipeline. The example is deliberately small so the structure is visible without drowning in detail.
