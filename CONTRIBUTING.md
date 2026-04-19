# Contributing to narada.usc

Thank you for improving the Universal Systems Constructor. This document is the single source of truth for how to participate without creating hidden arbitrariness.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Architecture](#architecture)
- [Making Changes](#making-changes)
  - [Schemas](#schemas)
  - [Commands](#commands)
  - [Templates](#templates)
  - [Policies](#policies)
- [Testing](#testing)
- [Commit Conventions](#commit-conventions)
- [Public Boundary](#public-boundary)
- [Review Checklist](#review-checklist)
- [Getting Help](#getting-help)

---

## Prerequisites

- **Node.js** >= 18 (ESM required)
- **pnpm** (workspace-managed monorepo)
- Familiarity with [JSON Schema](https://json-schema.org/) draft-2020-12

No TypeScript compiler is used. All source is plain JavaScript with ESM imports.

---

## Development Setup

```bash
git clone <repo-url> narada.usc
cd narada.usc
pnpm install
```

Verify the workspace:

```bash
pnpm validate        # validate all examples, sessions, and schemas
pnpm usc:list        # list existing sessions
```

---

## Architecture

The repository is a pnpm workspace with four packages:

| Package | Responsibility | Entry Points |
|---------|---------------|--------------|
| `packages/core` | Schema registry, AJV validator, construction model | `src/validator.js` |
| `packages/compiler` | Artifact generation, templates, session/app init, intent refinement | `src/index.js`, `src/refine-intent.js` |
| `packages/cli` | Command routing, argument parsing, I/O | `src/usc.js` |
| `packages/policies` | Admissibility policy definitions and canonical examples | `examples/*.json` |

Cross-package imports use `link:../<pkg>` in `package.json` and resolve via Node ESM.

Schema `$id` URIs are canonical: `https://narada2.dev/schemas/usc/<name>.schema.json`.
Relative `$ref` such as `./task.schema.json` resolves through AJV's schema registry after all schemas are loaded.

---

## Making Changes

### Schemas

1. Add or edit `.schema.json` files in `packages/core/schemas/`.
2. Ensure `$id` follows the canonical URI pattern.
3. Use relative `$ref` to reference sibling schemas.
4. Add or update a matching example in `packages/core/examples/` or `packages/policies/examples/`.
5. Run `pnpm validate` before committing.

**Schema change checklist:**
- [ ] `$id` is canonical and unique
- [ ] `$schema` is `https://json-schema.org/draft/2020-12/schema`
- [ ] All `$ref` targets exist and resolve
- [ ] At least one example file validates against the new schema
- [ ] No breaking change to existing examples without updating them

### Commands

1. Implement command logic in the appropriate package:
   - Pure domain logic → `packages/compiler/src/`
   - Validation/schema logic → `packages/core/src/`
   - Argument parsing and orchestration → `packages/cli/src/usc.js`
2. Export new compiler functions from `packages/compiler/src/index.js` if they are part of the public compiler surface.
3. Add a named script to root `package.json` if the command should be user-invokable via `pnpm`.
4. Update `README.md` with usage and options.

**Command checklist:**
- [ ] `pnpm usc -- <command> --help` or equivalent documents all flags
- [ ] `--` separator is used in `package.json` scripts (required for pnpm arg forwarding)
- [ ] No hardcoded absolute paths; use `fileURLToPath` + `dirname` resolution

### Templates

1. Store templates in `packages/compiler/templates/`.
2. Use plain JavaScript string interpolation or literal file copies.
3. Ensure generated artifacts validate against their schemas.
4. Update example outputs if templates change.

### Policies

1. Define new policy types in `packages/policies/`.
2. Provide a canonical example JSON file.
3. Reference the policy schema from construction-state or task-graph schemas if the policy is meant to be embedded.
4. Document the protocol in `docs/protocols/`.

---

## Testing

The only automated test surface is schema validation:

```bash
pnpm validate                    # substrate examples + sessions
pnpm validate -- --app <path>    # external app repo
```

Manual verification for commands:

```bash
# Refinement
pnpm usc:refine -- --intent "I want ERP system" --format json

# Session creation
pnpm usc:init -- --name test-session --principal "Test" --intent "..."

# App creation
rm -rf /tmp/test-app && pnpm usc:init-app -- --name test-app --target /tmp/test-app --principal "Test" --intent "..."
pnpm usc -- validate --app /tmp/test-app
```

All examples in `packages/core/examples/` and `packages/policies/examples/` must remain valid at all times.

---

## Commit Conventions

Use [Changesets](https://github.com/changesets/changesets) for versioning:

```bash
pnpm changeset    # describe your change
```

Commit message style (plain, not conventional commits):

```
Add <feature> to <package>

- What changed
- Why it changed
- Any breaking changes or migration notes
```

Keep commits focused. A commit should touch one concern (schema, command, docs, etc.).

---

## Public Boundary

This repository is the **public substrate**. It must contain only reusable constructor infrastructure.

**Allowed:**
- Constructor code, schemas, protocols
- Reusable templates and examples
- Sanitized session patterns
- Public policy definitions

**Forbidden:**
- Private repository names (unless intentionally public)
- Credentials, tokens, customer data, private mailbox content
- App-specific implementation decisions that belong in `narada.usc.<app-name>`
- Runtime or product code that belongs in the `narada` product repo
- Operational traces, internal logs, or derivative status files

Never create derivative status files such as `*-EXECUTED.md`, `*-RESULT.md`, or `*-DONE.md`. Update canonical artifacts directly.

---

## Review Checklist

Before opening a PR or concluding work:

- [ ] `pnpm validate` passes with no errors
- [ ] All new files have a clear, single responsibility
- [ ] No secrets or private data committed
- [ ] `README.md` updated if user-facing behavior changed
- [ ] `AGENTS.md` updated if agent-facing conventions changed
- [ ] `CONTRIBUTING.md` updated if contribution process changed
- [ ] Changeset added if the change is version-worthy

---

## Getting Help

- Read [`AGENTS.md`](./AGENTS.md) for agent-oriented conventions and architecture guidance.
- Read [`docs/system.md`](./docs/system.md) for the full system overview.
- Read [`docs/protocols/`](./docs/protocols/) for admissibility, integration, and residual protocols.
- Open an issue for bugs, feature requests, or protocol clarifications.
