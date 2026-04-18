# Ambiguity Localization

Semantic authority (Bob, co-maintainer) localizes decision-relevant arbitrariness before planning.

## Identified Ambiguities

### A1: Doc format

- **What is unclear?** Whether to use Markdown, MDX, or structured comments.
- **Governing?** Yes — affects tooling, contributor experience, and automation.
- **Options:**
  1. Markdown files in `/docs` with a static site generator
  2. MDX for interactive examples
  3. JSDoc/TSDoc comments rendered by TypeDoc
- **Authority:** Semantic (Bob) with principal consent.
- **Resolution:** Deferred to decision surface.

### A2: Hosting provider

- **What is unclear?** Where to host the site.
- **Governing?** Yes — affects domain, build pipeline, and access control.
- **Options:**
  1. GitHub Pages (free, simple)
  2. Netlify (free tier, branch previews)
  3. Vercel (free tier, fast builds)
- **Authority:** Planning (Bob proposes, Alice decides).
- **Resolution:** Deferred to decision surface.

### A3: Synchronization mechanism

- **What is unclear?** How to keep docs in sync with code.
- **Governing?** Yes — central to the principal intent.
- **Options:**
  1. CI step that fails if doc examples drift from code
  2. TypeDoc auto-generation from JSDoc
  3. Manual review checklist
- **Authority:** Semantic + execution.
- **Resolution:** Deferred to decision surface.

### A4: Branding and design

- **What is unclear?** Whether to invest in custom design or use a default theme.
- **Governing?** No — affects aesthetics but not admissibility of the construction.
- **Options:**
  1. Default theme
  2. Custom colors and logo
  3. Full custom design
- **Authority:** Decision-inert for construction; principal may declare preference later.
- **Resolution:** Marked as decision-inert. Use default theme unless principal specifies otherwise.

## Summary

Three ambiguities are construction-relevant and must be closed before execution. One is inert and will not block planning.
