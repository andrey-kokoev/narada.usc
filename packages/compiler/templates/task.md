# Task Template

A USC task is a construction-planning artifact: a durable, machine-readable proposal for a unit of work. It is produced by a compiler/deriver and consumed by a downstream runtime (e.g., Narada proper) that owns claim, execution, resolution, and confirmation authority.

## Required Fields

| Field | Description |
|-------|-------------|
| `id` | Unique task identifier (e.g., `T1`, `task-20260418-001`) |
| `title` | One-line summary |
| `intent` | What transformation is intended? |
| `scope` | What system surface does this touch? |
| `authority_locus` | Who or what can authorize this work? (`principal`, `semantic`, `planning`, `execution`, `review`, `integration`) |
| `dependencies` | Task IDs or conditions that must be satisfied first |
| `transformation` | Executable description of what changes |
| `output_artifact` | What artifact(s) will exist after execution? |
| `evidence_requirement` | What evidence proves the transformation was performed correctly? |
| `review_predicate` | What condition must the evidence satisfy? |
| `residual_handling` | If the task fails or is blocked, what happens? (`new_task`, `principal_decision`, `declared_non_goal`, `decision_inert`) |
| `status` | `draft`, `proposed`, `admitted`, `archived` |

## Optional Fields

| Field | Description |
|-------|-------------|
| `inputs` | Required inputs for the transformation |
| `expected_outputs` | Named outputs the artifact must produce |
| `acceptance` | Acceptance criteria for admitting the task into the construction line |
| `residual_of` | If this task derives from a residual, link the source task |
| `supersedes` | If this task replaces another, link the superseded task |

## Notes on Authority Boundary

- **This template describes a planning artifact**, not a runtime work item.
- `narada.usc` is a deriver/compiler. It does not claim, execute, complete, reject, block, or loop over tasks.
- Downstream runtime authority (claim, execute, resolve, confirm) is owned by Narada proper or another operator runtime.
- Review predicates and evidence requirements are **planning contracts** — they specify what a reviewer should look for, but the actual review execution belongs to the runtime.

## Example

```markdown
# Task: Add JSON schema validation to public API docs

## id
T3

## title
Add JSON schema validation to public API docs

## intent
Ensure the API documentation stays synchronized with the actual request/response shapes.

## scope
Public documentation site (`docs/`) and API schema files (`schemas/`).

## authority_locus
execution

## dependencies
- T1: Define public API surface
- T2: Write JSON schemas for endpoints

## transformation
Add a CI step that validates every example in the documentation against its corresponding JSON schema.

## output_artifact
- `.github/workflows/docs-validate.yml`
- Updated documentation with validated examples

## evidence_requirement
CI run on PR demonstrates that invalid examples fail the build.

## review_predicate
A deliberate invalid example inserted in a test PR is caught by the CI step.

## residual_handling
If schema validation tooling is incompatible with our doc format, create a residual task to evaluate alternative validators.

## status
proposed
```

---

*For machine validation, use `task.schema.json`.*
