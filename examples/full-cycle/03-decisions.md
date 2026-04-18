# Explicit Decisions and Closures

Planning authority (Bob) proposes closures. Principal authority (Alice) confirms.

## Closure 1: Doc Format — MDX with VitePress

**Decision:** Use MDX files in a `/docs` directory, rendered by VitePress.

**Rationale:**
- Markdown is familiar to contributors.
- MDX allows interactive widget examples (critical for a widget library).
- VitePress is Vue-based but can render vanilla components; the team has Vue experience.
- TypeDoc alone would not support narrative docs and interactive examples.

**Alternatives rejected:**
- Pure JSDoc/TypeDoc: insufficient for narrative and interactive content.
- Docusaurus: heavier than needed; VitePress is simpler for a single-library site.

**Reversibility:** Reversible. If VitePress becomes unmaintained, the MDX content can migrate to another MDX renderer.

**Reopening condition:** If VitePress drops MDX support or becomes unmaintained for > 12 months.

**Authority:** Semantic (Bob proposes) + Principal (Alice confirms).

---

## Closure 2: Hosting — GitHub Pages

**Decision:** Host on GitHub Pages via GitHub Actions.

**Rationale:**
- Free for public repos.
- No additional accounts or credentials.
- Builds directly from the repo; no external dependency.
- Sufficient for a static documentation site.

**Alternatives rejected:**
- Netlify/Vercel: introduce external accounts and access management for a team that prefers GitHub-native workflows.

**Reversibility:** Reversible. Can migrate to Netlify/Vercel later without changing content.

**Reopening condition:** If GitHub Pages limits become constraining (traffic, build time).

**Authority:** Planning (Bob proposes) + Principal (Alice confirms).

---

## Closure 3: Synchronization — CI Validation

**Decision:** Add a CI step that validates every code example in the docs against the actual library build.

**Rationale:**
- Auto-generation (TypeDoc) is insufficient for narrative docs.
- Manual review is unreliable.
- CI validation catches drift at PR time.

**Mechanism:**
- Extract code examples from MDX files.
- Run them as integration tests against the built library.
- Fail the build if an example throws or produces wrong output.

**Reversibility:** Reversible. Can replace with a different validation mechanism.

**Reopening condition:** If the validation mechanism becomes too slow or too brittle.

**Authority:** Semantic + Execution (Bob proposes; lead dev confirms feasibility).

---

## Decision-Inert Distinction

**D4: Branding and design**

Marked as inert. The construction of the docs site does not depend on custom branding. The principal may request a custom theme later as a separate task.

**Authority:** Principal (implicit by not elevating to decision).
