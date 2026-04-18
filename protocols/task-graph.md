# Task Graph Protocol

A USC task graph is a durable representation of construction work.

## Task Validity

A task is valid only when it states:

- intended transformation
- authority locus
- inputs and dependencies
- output artifact
- evidence requirement
- review predicate
- residual handling rule

## Edge Types

| Edge | Meaning |
|------|---------|
| `blocks` | target cannot start until source is complete |
| `validates` | source supplies evidence or check for target |
| `conflicts_with` | source and target cannot both integrate without decision |
| `supersedes` | source replaces target |
| `derives` | target was generated from source residual or decomposition |

Edges should exist only when they change admissible execution, review, or integration.
