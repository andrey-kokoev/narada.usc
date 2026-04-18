# narada.usc

`narada.usc` is the public substrate for Universal Systems Constructor (USC) work.

USC is a constructive control process that turns principal intent into admissible system transformation by preserving articulated difference across time, authority, execution, and review.

This repository is not a product app and not an operations repo. It defines the reusable construction grammar: construction states, task graphs, authority loci, review predicates, residual handling, prompts, and session protocols.

Concrete systems built under this discipline should live in app-specific repositories such as:

```text
narada.usc.<app-name>
```

## Repository Role

| Repository | Role |
|------------|------|
| `thoughts` | Concept notes and public theory |
| `narada` | Runtime substrate that can host operations, charters, durable work, and execution |
| `narada.usc` | USC construction grammar and reusable protocol substrate |
| `narada.usc.<app>` | Concrete system constructed under USC discipline |
| `narada.sonar` | Private operational deployment using Narada |

## Contents

| Path | Purpose |
|------|---------|
| `concepts/` | Conceptual definitions and positioning |
| `protocols/` | Operational protocols for USC practice |
| `schemas/` | Machine-readable shapes for construction artifacts |
| `prompts/` | Reusable prompts/spells for de-arbitrarization and delegation |
| `tasks/` | Task-file conventions and lifecycle rules |
| `reviews/` | Review semantics and evidence requirements |
| `sessions/` | Session record conventions |
| `examples/` | Minimal public examples of USC-shaped work |
| `apps/` | Naming and boundary guidance for concrete USC app repos |

## Core Rule

A construction step is admissible only when its authority locus, dependencies, executable transformation, evidence path, and review predicate are explicit. Otherwise the blocker must become residual state.
