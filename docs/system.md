# narada.usc As A System

`narada.usc` is the executable implementation of the Universal Systems Constructor.

It takes principal intent plus constructor grammar, applies admissibility policies, validates construction artifacts, and generates USC-governed repositories or cycles. It does not execute the constructed system itself; generated repos may later compile toward Narada, GitHub issues, local task files, or other targets.

```mermaid
flowchart TD
  User["User / Principal"] --> CLI["USC CLI<br>packages/cli"]

  subgraph Constructor["narada.usc Constructor"]
    CLI --> Commands["Commands<br>init / cycle / validate / refine / future compile"]
    Commands --> Core["Core<br>packages/core"]
    Commands --> Compiler["Compiler<br>packages/compiler"]
    Commands --> Policies["Policies<br>packages/policies"]
    Commands --> DomainPacks["Domain Priors<br>packages/domain-packs"]

    Core --> Schemas["Schemas<br>construction state / task graph / review / residual"]
    Core --> Validator["Validator<br>Ajv schema validation"]
    Compiler --> Templates["Templates<br>repo, cycle, task, review, residual, closure"]
    Policies --> CIS["CIS Policy<br>constructive invariance admissibility"]
    DomainPacks --> ERP["ERP pack"]
    DomainPacks --> Helpdesk["Helpdesk pack"]
    DomainPacks --> SaaS["SaaS pack"]
    DomainPacks --> Workflow["Workflow Automation pack"]
    DomainPacks --> Agent["AI Agent Operation pack"]
    DomainPacks --> Pipeline["Data Pipeline pack"]
    DomainPacks --> Internal["Internal Tools pack"]
  end

  subgraph SourceGrammar["USC Grammar"]
    Intent["Principal Intent"]
    Decisions["Decision Surface / Closure"]
    TaskGraph["Task Graph"]
    Reviews["Review Predicates"]
    Residuals["Residuals"]
    Evidence["Evidence"]
  end

  Compiler --> Generated["Generated USC-Governed Repo<br>narada.usc.<system>"]
  Generated --> UscDir["usc/<br>construction-state.json<br>task-graph.json<br>cycles/<br>reviews/<br>residuals/<br>closures/"]
  Generated --> Product["Product Code<br>outside usc/"]

  UscDir --> SourceGrammar
  SourceGrammar --> Validator
  CIS --> Validator
  Schemas --> Validator

  Validator --> Report["Validation Report<br>accept / reject / residualize"]

  Generated -. future compile .-> Narada["Narada Runtime Target<br>operations / charters / durable work"]
  Generated -. future compile .-> OtherTargets["Other Targets<br>issues / local tasks / docs / scripts"]
```

## Constructor Package Roles

```mermaid
flowchart LR
  CLI["packages/cli<br>user entrypoint"] --> Core["packages/core<br>model + schemas + validation"]
  CLI --> Compiler["packages/compiler<br>artifact generation"]
  CLI --> Policies["packages/policies<br>admissibility policies"]
  CLI --> DomainPacks["packages/domain-packs<br>packaged domain priors"]

  Compiler --> Templates["compiler templates"]
  Compiler --> Core
  Compiler --> DomainPacks
  Policies --> Core
  DomainPacks --> Core

  Core --> Examples["examples<br>validation fixtures"]
  Compiler --> GeneratedRepo["generated repo<br>usc/ + product surface"]
```

## Generated Repo Shape

```mermaid
flowchart TD
  Repo["narada.usc.<system>"] --> Usc["usc/ construction artifacts"]
  Repo --> Product["product/runtime code"]
  Repo --> Docs["README / AGENTS"]

  Usc --> State["construction-state.json"]
  Usc --> Graph["task-graph.json"]
  Usc --> Cycles["cycles/"]
  Usc --> Reviews["reviews/"]
  Usc --> Residuals["residuals/"]
  Usc --> Closures["closures/"]

  State --> Policies["admissibility policies"]
  Graph --> Tasks["tasks"]
  Reviews --> Evidence["evidence checks"]
  Residuals --> NextWork["new work / principal decision / closed branch"]
```

## Domain Prior Flow

Domain priors are reusable knowledge about where decision-relevant arbitrariness usually hides in a class of systems. They are packaged as domain packs in `packages/domain-packs/`. They plug into the `refine` command to produce richer decision surfaces and seed task graphs without inventing app-specific decisions.

```text
principal intent -> domain pack detects -> domain pack refines
                                          |
                                          v
                              decision surface + seed tasks + residuals
```

```mermaid
flowchart LR
  Intent["Principal Intent"] --> Refine["usc refine"]
  Refine --> Detect{"Domain detected?"}
  Detect -->|yes| Pack["Domain Pack<br>erp / helpdesk / saas ..."]
  Detect -->|no| Generic["Generic Refinement"]
  Pack --> Artifacts["Ambiguities<br>Questions<br>Seed Tasks<br>Residuals"]
  Generic --> Artifacts
  Artifacts --> DecisionSurface["Decision Surface"]
```

A domain prior is not a concrete app repo. It contains no product code, customer-specific decisions, or secrets. It is constructor knowledge that helps collapse arbitrariness for a problem family.

## Boundary

`narada.usc` constructs and validates governed construction artifacts. It does not replace a runtime. Narada is one future target for compiled operations; app repos may also target other execution systems.

## CLI Interaction

```mermaid
sequenceDiagram
  autonumber
  participant User as User / Principal
  participant CLI as USC CLI
  participant Compiler as Compiler
  participant Core as Core Validator
  participant Policies as Policy Registry
  participant Repo as USC-Governed Repo

  User->>CLI: usc init <path> --name ... --intent ... --cis
  CLI->>Policies: load requested admissibility policies
  Policies-->>CLI: CIS policy object
  CLI->>Compiler: generate repo artifacts
  Compiler->>Repo: write README, AGENTS, usc/ artifacts
  CLI->>Core: validate generated construction-state and task-graph
  Core-->>CLI: validation report
  CLI-->>User: initialized repo or validation errors

  User->>CLI: usc cycle --intent ...
  CLI->>Compiler: create construction cycle/checkpoint
  Compiler->>Repo: write usc/cycles/<cycle>/ artifacts
  CLI->>Core: validate updated repo
  Core-->>User: valid / invalid
```

## Construction Artifact Lifecycle

```mermaid
stateDiagram-v2
  [*] --> IntentCaptured: principal intent
  IntentCaptured --> AmbiguityLocalized: de-arbitrarization
  AmbiguityLocalized --> ClosureRecorded: decisions made
  ClosureRecorded --> TaskGraphFormed: planning
  TaskGraphFormed --> TaskAdmitted: tasks admitted to construction line
  TaskAdmitted --> EvidenceProduced: transformation performed
  EvidenceProduced --> Reviewed: review predicate applied
  Reviewed --> Integrated: downstream runtime accepts
  Reviewed --> ResidualCreated: blocker or ambiguity remains
  ResidualCreated --> AmbiguityLocalized: resolve residual
  Integrated --> ClosureRecorded: update durable closure
  Integrated --> [*]
```

## CIS Admissibility Path

```mermaid
flowchart TD
  Change["Proposed construction step"] --> Policy["CIS admissibility policy"]
  Policy --> F["Preserve F(s)<br>functional properties"]
  Policy --> T["Preserve T(s)<br>transformation potential"]
  Policy --> Compat["Compatibility or migration path"]
  Policy --> Evidence["Verification evidence"]
  Policy --> Closure["Semantic closure"]

  F --> Review["Review predicates"]
  T --> Review
  Compat --> Review
  Evidence --> Review
  Closure --> Review

  Review --> Pass{"All required checks pass?"}
  Pass -->|yes| Integrate["Integration allowed"]
  Pass -->|no| Residual["Residual state<br>failed_review / missing_policy / missing_effector"]
  Residual --> Rework["Rework, policy decision, or branch closure"]
```

## Compile Target Model

```mermaid
flowchart LR
  Repo["USC-governed repo<br>usc/ + product code"] --> Compiler["USC compiler"]

  Compiler --> Files["Repo artifacts<br>README / AGENTS / tasks / docs"]
  Compiler --> Issues["Issue tracker<br>tasks / residuals / review items"]
  Compiler --> Narada["Narada target<br>operations / charters / policies"]
  Compiler --> Scripts["Local scripts<br>validation / setup / checks"]

  Narada --> Runtime["Runtime execution<br>daemon / workers / observation"]
  Issues --> Humans["Human or agent execution"]
  Files --> RepoLoop["Updated construction state"]
  Scripts --> RepoLoop
  Runtime --> RepoLoop
```

## Authority Loci In A Construction Cycle

```mermaid
flowchart TD
  Principal["Principal authority<br>owns intent and acceptance"] --> Semantic["Semantic authority<br>localizes ambiguity"]
  Semantic --> Planning["Planning authority<br>forms task graph"]
  Planning --> Execution["Execution authority<br>performs transformation"]
  Execution --> Review["Review authority<br>checks evidence"]
  Review --> Integration["Integration authority<br>accepts / rejects / residualizes"]
  Integration --> Truth["Durable truth authority<br>records state"]
  Truth --> Planning

  Review -. failed predicate .-> Residual["Residual"]
  Integration -. reopened closure .-> Semantic
  Residual --> Principal
  Residual --> Planning
```
