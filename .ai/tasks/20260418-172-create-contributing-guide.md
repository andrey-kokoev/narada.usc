# Task 172: Create CONTRIBUTING.md

## Context

`narada.usc` is now a multi-package executable constructor with:
- `packages/core` — schemas and validation
- `packages/compiler` — artifact generation and intent refinement
- `packages/cli` — command surface
- `packages/policies` — admissibility definitions

The repository has user-facing commands (`usc:init`, `usc:init-app`, `usc:refine`, `validate`) and a public boundary. There is no contributor guide.

## Goal

Create `CONTRIBUTING.md` that covers:

1. Prerequisites (Node 18+, pnpm, ESM, no TypeScript)
2. Development setup (`pnpm install`, `pnpm validate`)
3. Architecture (four packages, cross-package linking, schema `$id` conventions)
4. Making changes:
   - Schemas (canonical `$id`, `$ref`, examples)
   - Commands (package placement, `package.json` scripts, `--` separator)
   - Templates
   - Policies
5. Testing (schema validation, manual command verification)
6. Commit conventions (Changesets, plain message style)
7. Public boundary (what belongs here vs `narada` vs `narada.usc.<app>`)
8. Review checklist
9. Getting help (docs references)

## Non-Goal

- Do not add CI/CD workflows
- Do not add a code of conduct
- Do not add issue templates

## Success Criteria

- [ ] `CONTRIBUTING.md` exists at repository root
- [ ] `pnpm validate` still passes
- [ ] File references real paths and commands that exist in the repo
- [ ] No private or operational content in the guide

---

## Execution Notes

**Date:** 2026-04-13

Created `CONTRIBUTING.md` at repository root covering all goal items:
- Prerequisites, setup, architecture
- Change workflows for schemas, commands, templates, policies
- Testing via `pnpm validate` and manual command verification
- Commit conventions (Changesets, plain messages)
- Public boundary rules (no secrets, no app-specific decisions, no derivative status files)
- Review checklist
- Getting help references

`pnpm validate` passes. No private or operational content included.
