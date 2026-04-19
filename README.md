# narada.usc

`narada.usc` is the executable implementation of the Universal Systems Constructor.

USC is a constructive control process that turns principal intent into admissible system transformation by preserving articulated difference across time, authority, execution, and review.

This repo contains the constructor code — the CLI, schemas, compiler, and policies — that initializes, validates, and eventually compiles USC-governed system repositories.

For a compact system diagram, see [docs/system.md](docs/system.md).

## Repository Role

| Repository | Role |
|------------|------|
| `thoughts` | Theory of USC |
| `narada.usc` | **Executable USC constructor implementation** |
| `narada.usc.<app>` | Concrete system constructed/governed by USC |
| `narada` | Optional compile/runtime target for operations/charters |

## Architecture

| Package | Purpose |
|---------|---------|
| `packages/cli` | Executable entrypoint (`usc validate`, `usc init-session`, `usc init-app`) |
| `packages/core` | Construction model, schema registry, and validator |
| `packages/compiler` | Artifact generation (session init, app init, templates) |
| `packages/policies` | Admissibility policy definitions and examples |
| `docs/concepts/` | Conceptual definitions and positioning |
| `docs/protocols/` | Operational protocols for USC practice |
| `examples/` | Minimal and full-cycle examples of USC-shaped work |

## Quick Start

```bash
pnpm install
pnpm usc:init -- --name my-session --principal "Alice" --intent "Add a public API documentation site"
pnpm validate
```

## CLI Commands

### Validate

Validate examples, sessions, and app repos against JSON schemas:

```bash
pnpm validate                          # substrate examples and sessions
pnpm validate -- --app ../narada.usc.my-app   # external app repo
```

### Init Session

Create a construction session inside the substrate repo:

```bash
pnpm usc:init -- --name my-session --principal "Alice" --intent "..."
```

Options:
- `--force` — overwrite an existing session
- `--cis` — include a required CIS admissibility policy

### List Sessions

```bash
pnpm usc:list
```

### Init App

Create a new concrete app repo outside the substrate:

```bash
pnpm usc:init-app -- --name my-app --target ../narada.usc.my-app --principal "Alice" --intent "Build app X" --cis --git
```

Options:
- `--force` — overwrite an existing target
- `--cis` — include a required CIS admissibility policy
- `--git` — initialize a git repository

### Refine Intent

Transform raw principal intent into decision-relevant ambiguity, questions, and construction artifacts:

```bash
pnpm usc:refine -- --intent "I want ERP system" --format json
pnpm usc:refine -- --intent "I want support helpdesk" --format md
```

Write refinement into an app repo:

```bash
pnpm usc:refine -- --target ../narada.usc.my-app --intent "I want ERP system" --format json
```

`refine` does not implement the system. It surfaces hidden arbitrariness and produces first construction artifacts.

## Future: Compile Target

The constructor will eventually compile USC-governed app repos into runnable operations. Narada is the intended runtime target, but it is not required — USC can be practiced with any durable task system.

## Boundaries

- `narada.usc` is constructor code, not a product app.
- `narada.usc.<app-name>` contains product code and app-specific construction state.
- Protocols/schemas/templates are constructor grammar inputs, not the product itself.
