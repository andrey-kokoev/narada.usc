# AGENTS.md — narada.usc

This repository defines the reusable substrate for Universal Systems Constructor work.

## Working Posture

Use Progressive De-Arbitrarization before implementation. Do not answer or implement a presenting request if hidden decision-relevant arbitrariness remains.

Preserve these distinctions:

- principal intent vs inferred policy
- semantic closure vs execution
- task creation vs task claiming
- evidence vs assertion
- review finding vs integration decision
- residual blocker vs informal commentary

## Filesystem Rules

- Do not create derivative status files such as `*-EXECUTED.md`, `*-RESULT.md`, or `*-DONE.md`.
- Update the canonical artifact directly when work is complete.
- If review finds residual work, create or update a normal task file.
- Keep private operational traces out of this public repository.

## Public Boundary

This repo may contain reusable protocols, schemas, examples, and sanitized session patterns.

This repo must not contain:

- private repo names unless intentionally public
- credentials, tokens, customer data, private mailbox content, or internal operational traces
- app-specific implementation decisions that belong in `narada.usc.<app-name>`
- runtime or product code that belongs in the `narada` product repo

## Verification

This repo is documentation/protocol first. Prefer targeted checks:

- inspect Markdown links when changing docs
- validate JSON schemas when changing schemas
- do not run broad unrelated test suites

## Starting a Session

When creating a new USC session inside the substrate repo:

```bash
cd /home/andrey/src/narada.usc
pnpm usc:init -- --name <session-name> --principal "<name>" --intent "<text>"
```

This creates `sessions/<session-name>/` with all templates, starter JSON, and subfolders.

## Creating an App Repo

When creating a new concrete USC app repo outside the substrate:

```bash
cd /home/andrey/src/narada.usc
pnpm usc:init-app -- --name <app-name> --target <path> --principal "<name>" --intent "<text>"
```

This creates a new app directory with `README.md`, `AGENTS.md`, and a `usc/` directory containing construction artifacts.

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

## Task File Policy

Task files in this repo follow the conventions in `tasks/README.md`. Do not create derivative execution logs.
