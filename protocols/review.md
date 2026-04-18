# Review Protocol

Review compares construction evidence against the task's review predicate.

## Review Inputs

- task statement
- authority locus
- declared dependencies
- changed artifacts
- execution evidence
- review predicate
- residual claims from executor

## Review Outcomes

| Outcome | Meaning |
|---------|---------|
| `accept` | evidence satisfies predicate; integration may proceed |
| `reject` | evidence fails predicate; work must not integrate |
| `residualize` | new blocker or ambiguity must become durable task/decision |
| `reopen` | prior closure must be explicitly reopened before continuing |

## Rule

Review findings are not integration decisions unless the reviewer also holds integration authority. The locus must be explicit.
