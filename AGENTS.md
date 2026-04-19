# AGENTS.md — narada.usc

This repository is the **executable implementation** of the Universal Systems Constructor.

## Working Posture

Use Progressive De-Arbitrarization before implementation. Do not answer or implement a presenting request if hidden decision-relevant arbitrariness remains.

Preserve these distinctions:

- principal intent vs inferred policy
- semantic closure vs execution
- task creation vs task claiming
- evidence vs assertion
- review finding vs integration decision
- residual blocker vs informal commentary

## Architecture

New behavior should go through packages, not ad hoc scripts:

| Package | What belongs there |
|---------|-------------------|
| `packages/core` | Schema registry, validation logic, construction model |
| `packages/compiler` | Artifact generation, template rendering, session/app init |
| `packages/cli` | Command surface, argument parsing, orchestration |
| `packages/policies` | Admissibility policy definitions and examples |

## Filesystem Rules

- Do not create derivative status files such as `*-EXECUTED.md`, `*-RESULT.md`, or `*-DONE.md`.
- Update the canonical artifact directly when work is complete.
- If review finds residual work, create or update a normal task file.
- Keep private operational traces out of this public repository.

## Authority Boundary

`narada.usc` is a **deriver/compiler**, not an operator.

Allowed authority classes in this repo:
- `derive` — artifact generation (init, refine, plan, validate, cycle)
- `propose` — structured proposals (domain-pack refinements, task graphs)

Disallowed authority classes in this repo:
- `claim`, `execute`, `resolve`, `confirm`, `admin` — these belong in Narada proper

Do not add task claiming, execution, completion, rejection, blocking, or lifecycle loops to this repo.

## Public Boundary

This repo may contain constructor code, reusable protocols, schemas, examples, and sanitized session patterns.

This repo must not contain:

- private repo names unless intentionally public
- credentials, tokens, customer data, private mailbox content, or internal operational traces
- app-specific implementation decisions that belong in `narada.usc.<app-name>`
- runtime or product code that belongs in the `narada` product repo

## Initializing a USC Repo

`session` is not the user-facing primitive. Users initialize USC-governed construction repos:

```bash
cd /home/andrey/src/narada.usc
pnpm usc -- init <path> --name <name> --principal "<name>" --intent "<text>"
```

## Opening a Construction Cycle

Inside an existing USC repo, open a construction cycle/checkpoint:

```bash
# From inside a USC repo (direct node invocation)
cd /path/to/narada.usc.<system>
node /home/andrey/src/narada.usc/packages/cli/src/usc.js cycle --intent "<text>"

# From the substrate repo
pnpm --dir /home/andrey/src/narada.usc usc -- cycle --target /path/to/narada.usc.<system> --intent "<text>"
```

## Schema Validation

Validate example, session, and app documents against JSON schemas:

```bash
cd /home/andrey/src/narada.usc
pnpm validate
```

Validate an external app repo:

```bash
cd /home/andrey/src/narada.usc
pnpm validate -- --app <path-to-app-repo>
```

This checks structural conformance including `$ref` resolution, not just JSON syntax.
