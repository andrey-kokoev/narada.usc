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
| `narada.usc` | **USC construction grammar and reusable protocol substrate** |
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
| `examples/` | Minimal and full-cycle examples of USC-shaped work |
| `examples/policies/` | Reusable admissibility policy examples |
| `templates/` | Concrete artifact templates ready for use |
| `apps/` | Naming and boundary guidance for concrete USC app repos |

## Core Rule

A construction step is admissible only when its authority locus, dependencies, executable transformation, evidence path, and review predicate are explicit. Otherwise the blocker must become residual state.

## Quick Start

1. Read [`concepts/universal-systems-constructor.md`](concepts/universal-systems-constructor.md) for the core idea.
2. Read [`protocols/construction-state.md`](protocols/construction-state.md) for the construction state protocol.
3. Read [`protocols/cis-admissibility-policy.md`](protocols/cis-admissibility-policy.md) for how admissibility policies constrain construction.
4. Walk through [`examples/full-cycle/`](examples/full-cycle/) for a complete sanitized example.
5. Use [`templates/`](templates/) to start your own USC session.
6. See [`examples/policies/`](examples/policies/) for reusable admissibility policy examples.

## Boundaries

- **`narada.usc` is reusable substrate.** It contains no product code, no private operational traces, and no app-specific decisions.
- **`narada.usc.<app-name>` is a concrete constructed system.** It contains product code, private decisions, domain-specific task graphs, and deployment configuration.
- **Polished generic concepts** may be extracted to `thoughts`.
- **Runtime/product code** belongs in the appropriate product/runtime repo (e.g., `narada`).

## Narada Compatibility

See [`protocols/narada-compatibility.md`](protocols/narada-compatibility.md). USC can be practiced manually or with any durable task system. Narada is one valid runtime that can host USC-shaped work, but it is not required.
