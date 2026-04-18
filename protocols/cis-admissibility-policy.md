# CIS Admissibility Policy

Constructively Invariant Systems (CIS) is a USC admissibility policy family that restricts accepted construction states to those whose evolution preserves functional properties `F(s)` and transformation potential `T(s)`.

## Relationship to USC

```text
USC   = constructor mechanism
CIS   = admissibility policy for accepted construction/evolution
CICSC = one concrete compiler/runtime pattern satisfying CIS
```

- USC is the grammar of construction.
- CIS is a policy that constrains what USC may accept.
- CICSC is one way to satisfy CIS; it is not required by every USC state.

## What CIS Constrains

CIS is active across the entire construction lifecycle:

| Phase | CIS Obligation |
|-------|----------------|
| **De-arbitrarization** | Ambiguity resolution must not eliminate functional properties or transformation potential |
| **Task formation** | Tasks must preserve `F(s)` and `T(s)` or explicitly justify why a property is being changed |
| **Execution** | Transformations must not unknowingly violate preserved properties |
| **Review** | Review predicates must include checks for CIS obligations |
| **Integration** | Integration authority must verify CIS satisfaction before accepting work |
| **Closure** | Closed decisions must not silently commit to CIS violations |

## CIS Requirements

A CIS policy specifies five requirement categories:

### 1. Functional Properties `F(s)`

What the system must continue to do correctly after construction.

> Example: "All public API contracts remain backward-compatible for one major version."

### 2. Transformation Potential `T(s)`

What capabilities must remain realizable after construction.

> Example: "The system must remain deployable to GitHub Pages without vendor migration."

### 3. Compatibility or Migration

How evolution must handle interface or data changes.

> Example: "Schema changes require a migration script and a rollback path."

### 4. Verification Evidence

What evidence must demonstrate that CIS obligations are met.

> Example: "CI must run integration tests and a compatibility check before merge."

### 5. Semantic Closure

What naming, interface, and conceptual commitments must remain stable.

> Example: "The term `context_id` must not be redefined without a deprecation period."

## Failure Model

If a construction step fails to satisfy a CIS obligation:

- **Required policy** → Work cannot integrate. The failure becomes a `failed_review` or `missing_policy` residual.
- **Advisory policy** → Work may integrate with explicit principal consent and a durable record of the deviation.

CIS failure is not just documentation. It is a mechanical blocker unless explicitly overridden.

## CICSC Is One Realization

CICSC (the concrete pattern) satisfies CIS through:

- Explicit state representations
- Mechanical replay and verification
- Deterministic effect boundaries
- Durable truth authority

Other systems may satisfy CIS through different mechanisms. CIS is the policy; CICSC is one valid implementation strategy.
