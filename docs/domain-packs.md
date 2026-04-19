# Domain Packs

Domain packs are reusable constructor knowledge modules. Each pack surfaces decision-relevant ambiguity for a specific system domain without making product-specific decisions.

## Available Packs

| Pack | ID | Description |
|------|-----|-------------|
| SaaS | `saas` | Multi-tenant software-as-a-service systems |
| Workflow Automation | `workflow-automation` | Trigger/action/approval automation systems |
| AI Agent Operation | `ai-agent-operation` | Agent-backed operational systems |
| Data Pipeline | `data-pipeline` | Data ingestion, transformation, and reporting pipelines |
| Internal Tools | `internal-tools` | Admin panels and internal business tools |
| ERP | `erp` | Enterprise resource planning systems |
| Helpdesk | `helpdesk` | Support and ticketing systems |

## Using Domain Packs

### Explicit Selection

Force a specific domain pack via `--domain`:

```bash
usc refine --intent "I want SaaS app" --domain saas
usc refine --intent "I want workflow automation" --domain workflow-automation
usc refine --intent "I want AI agent operation" --domain ai-agent-operation
usc refine --intent "I want data pipeline" --domain data-pipeline
usc refine --intent "I want internal admin tool" --domain internal-tools
```

### Auto-Detection

If `--domain` is omitted, the engine auto-detects from keyword matching:

```bash
usc refine --intent "I want a multi-tenant billing platform"
```

Auto-detection tries built-in domains first, then domain packs.

## Pack Structure

Each domain pack lives in `packages/domain-packs/<id>/`:

```
<pack>/
  package.json                    # Package metadata
  src/
    index.js                      # Exports { id, name, detect, refine }
    refinement.js                 # Domain-specific ambiguity, questions, tasks
  schemas/
    <pack>-context.schema.json    # Context parameter schema
  templates/
    question-map.md               # Authority-mapped question template
  examples/
    <pack>.refinement.json        # Example refinement output
```

## Pack Interface

```javascript
export const id = "pack-id";
export const name = "Human-Readable Name";

export function detect(intent) {
  // Return true if this pack matches the intent
}

export function refine(intent) {
  // Return domain-specific refinement components:
  // { ambiguities[], questions[], assumptions[], suggested_closures[], seed_tasks[], residuals[] }
}
```

Common ambiguities, questions, seed tasks, and residuals are merged automatically by the refinement engine.

## Adding a New Pack

1. Create `packages/domain-packs/<id>/` with the structure above
2. Implement `detect()` and `refine()` in `src/refinement.js`
3. Export from `src/index.js`
4. Add static import to `packages/compiler/src/domain-packs.js`
5. Generate an example: `node packages/cli/src/usc.js refine --intent "..." --domain <id> --format json > packages/domain-packs/<id>/examples/<id>.refinement.json`
6. Run `pnpm validate` to ensure the example conforms to the refinement schema
7. Update this document

## Design Discipline

Domain packs must not:

- Assume specific vendors (e.g., Stripe, Salesforce, AWS)
- Assume B2B vs B2C unless the domain inherently requires it
- Make product-specific architectural decisions
- Call LLMs or external services
- Contain customer data or private references

Domain packs must:

- Surface hidden arbitrariness (ambiguity families)
- Ask authority-mapped questions
- Declare assumptions with confidence and reversibility
- Provide concrete seed tasks with evidence requirements
- Identify blocking and non-blocking residuals
