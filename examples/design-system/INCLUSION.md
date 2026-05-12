# INCLUSION.md - Design System (example)

> Example adaptation for a component library or design system.

This file extends the base [`INCLUSION.md`](../../INCLUSION.md) template with
guidance specific to a design system whose components are reused across many
products.

Design systems sit upstream of every product surface they touch. Their
inclusion defaults become every downstream team's path of least resistance.
That makes their `INCLUSION.md` unusually high-leverage.

---

## 1. Project Context

- **Product:** [Design system name.] Provides foundational components,
  tokens, and patterns to [N] downstream product teams.
- **Primary users:** Product engineers and designers consuming components.
- **End users:** Every user of every product that consumes this system. We
  do not get to assume who they are.
- **Known underserved users:** [Document known gaps. Examples: "Right-to-left
  layouts are partial. Switch-control support is unverified. Component-level
  text scaling above 200% breaks several layouts."]
- **Distribution context:** Used in [N] products spanning [web / iOS /
  Android / desktop]. Localized to [N] languages including RTL scripts.
- **Stakes:** A regression here is a regression in every downstream product.

---

## 2. Component Authoring Requirements

Generated or hand-authored components in this repo must:

- Have a documented accessible name, role, and state model.
- Be keyboard operable per the ARIA Authoring Practices Guide pattern for
  that component type. Cite the pattern in the component's README.
- Manage focus correctly: focus trap in modals, focus restoration on close,
  visible focus indicator on every interactive element meeting WCAG 2.4.11.
- Pass automated checks (axe, Pa11y, or equivalent) at the component level.
- Have at least one screen-reader test plan documented in the component's
  README.
- Support `prefers-reduced-motion` for any animation.
- Support `forced-colors: active` and high-contrast modes.
- Use design tokens for color, spacing, type, and motion - never hardcoded
  values - so themes, contrast modes, and density preferences can apply.
- Support RTL layouts. Use logical CSS properties (`margin-inline-start`,
  `padding-block-end`, etc.) instead of physical ones (`margin-left`).
- Support variable text length: components must not break when localized
  strings are 30-40% longer than English defaults.
- Not assume a single language direction, locale, or numeric system.

---

## 3. Token Design

- Color tokens are paired with intent (text, surface, border, focus, danger,
  success) and contrast role - not raw hex values exposed downstream.
- Every text-on-surface token pair has documented contrast ratios meeting
  WCAG 2.2 AA at minimum.
- Provide a high-contrast token theme.
- Provide a token theme for `prefers-reduced-transparency`.
- Motion tokens have a `none` variant that resolves when
  `prefers-reduced-motion: reduce` is set.
- Density tokens (compact, default, spacious) preserve a 24x24 minimum touch
  target even at the most compact setting.

---

## 4. Documentation & Examples

- Every component README includes: accessible name model, keyboard
  interactions, screen-reader behavior, RTL behavior, localization notes,
  known limitations.
- Examples in documentation use realistic, diverse user names, addresses,
  and content. Avoid placeholder names like "John Doe" or "Jane Smith" by
  default. Use a curated set of realistic, internationally varied placeholder
  data.
- Example imagery includes a representative range of skin tones, body types,
  ages, abilities, and contexts. No tokenized "diversity stock photo" set.
- Do not document accessibility features as "bonus." They are baseline.

---

## 5. Deprecation & Migration

- When deprecating a component or token, provide an automated migration path
  (codemod) where feasible, and a documented manual path otherwise.
- Never silently change accessibility behavior. Breaking changes to focus,
  ARIA, or keyboard interaction must be flagged in release notes.
- Provide at least one major version of overlap before removing a deprecated
  inclusive feature.
