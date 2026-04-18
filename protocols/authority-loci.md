# Authority Loci Protocol

USC distinguishes seven authority loci. One person or process may hold multiple loci, but the locus must remain explicit for every construction step.

## The Seven Loci

### 1. Principal Authority

The ultimate source of intent. The principal decides what the system should do and why.

- **Can delegate?** Yes, but delegation must be explicit and revocable.
- **Cannot delegate** Final say on intent, reversals of declared non-goals, and reopening of fundamental closures.
- **Typical holder** Product owner, system principal, executive sponsor.

### 2. Semantic Authority

Determines what the system means. Holds the ontology, naming, interfaces, and conceptual boundaries.

- **Can delegate?** Partially — specific domains can have local semantic authorities.
- **Cannot delegate** Cross-domain consistency, public API contracts, canonical term definitions.
- **Typical holder** Architect, domain expert, language designer.

### 3. Planning Authority

Decides how work is decomposed, sequenced, and assigned.

- **Can delegate?** Yes — planning can be distributed across teams or charters.
- **Cannot delegate** Integration sequencing, dependency resolution across boundaries, resource allocation for critical paths.
- **Typical holder** Project lead, construction planner, charter foreman.

### 4. Execution Authority

Performs transformations and produces evidence.

- **Can delegate?** Yes — execution is the most delegable locus.
- **Cannot delegate** Accountability for evidence quality, adherence to transformation specification, honest reporting of blockers.
- **Typical holder** Engineer, operator, automated worker, charter runtime.

### 5. Review Authority

Evaluates evidence against review predicates.

- **Can delegate?** Yes, but review authority should not also hold integration authority for the same work unless explicitly declared.
- **Cannot delegate** The review predicate itself (set by planning or semantic authority), honest application of the predicate.
- **Typical holder** Peer reviewer, QA, automated test suite, audit charter.

### 6. Integration Authority

Decides whether reviewed work is accepted into the durable system state.

- **Can delegate?** Yes, but integration is distinct from review to prevent self-certification.
- **Cannot delegate** Final accept/reject for changes that affect public contracts, security, or compliance boundaries.
- **Typical holder** Tech lead, release manager, integration charter, principal (for major changes).

### 7. Durable Truth Authority

Owns the record of what has been decided, executed, reviewed, and integrated.

- **Can delegate?** Partially — specific stores can have local administrators.
- **Cannot delegate** Integrity of the construction history, immutability of closed decisions, traceability from intent to effect.
- **Typical holder** Version control system, durable store, construction state database, audit log.

## Multi-Locus Holders

A single person or process may hold multiple loci. This is normal in small teams. The requirement is **explicitness**, not separation.

When one holder holds multiple loci:

- Declare which loci are active for each step.
- Be especially careful when review and integration are held by the same entity — self-certification is a known failure mode.
- Record the locus assignment in the task or session artifact.

## Locus Assignment Template

For any construction step, state:

```text
principal: <who>
semantic: <who>
planning: <who>
execution: <who>
review: <who>
integration: <who>
durable_truth: <system>
```

If a locus is irrelevant for this step, mark it `N/A` rather than leaving it implicit.
