# Narada Compatibility

`narada.usc` defines the Universal Systems Constructor grammar. It does not depend on Narada, and USC can be practiced manually or with any durable task system.

## Relationship

| Aspect | `narada.usc` | Narada |
|--------|--------------|--------|
| **What** | Construction grammar, protocols, schemas | Runtime substrate for operations, charters, and durable work |
| **Depends on** | Nothing (self-contained) | Product code, databases, adapters |
| **Used by** | Humans, any task system, any construction process | App repos that choose it as execution substrate |
| **Output** | Reusable protocols and schemas | Running operations, synced state, executed intents |

## How They Connect

- **Narada can host USC-shaped work.** Narada's control plane (foreman, scheduler, workers) can execute tasks that follow USC discipline. Narada's charters can perform semantic authority and review authority roles.
- **`narada.usc` is grammar, not runtime.** It tells you how to structure a construction session; it does not run it. Narada can be one runtime that respects this grammar.
- **App repos bridge the two.** A repo like `narada.usc.helpdesk` might use `narada.usc` for its construction discipline and Narada for its execution substrate.
- **No mandatory coupling.** You can practice USC with pen and paper, a GitHub Issues board, or a custom tool. Narada is one valid implementation target.

## When to Use Which

Use `narada.usc` when you need:
- A shared construction discipline across teams or tools
- Reusable templates and protocols
- Explicit authority boundaries and review semantics

Use Narada when you need:
- A durable runtime for operations and charters
- Automated execution, confirmation, and observation
- Integration with external systems (mail, webhooks, filesystem)

Use both when you want durable, automated execution that follows explicit construction discipline.
