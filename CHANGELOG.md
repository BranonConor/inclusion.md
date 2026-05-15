# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-05-15

### Fixed

- **MaxListenersExceededWarning during long questionnaires.** Each `ask()`
  call was registering a new `'close'` listener on the readline interface,
  so users running the full Design Decisions questionnaire saw
  `Possible EventEmitter memory leak detected. 11 close listeners added`
  starting around question 11. Now a single `'close'` handler is registered
  per prompter and rejects whatever `ask()` is in flight.

## [0.2.0] - 2026-05-12

### Added

- **Welcome flow.** A short, accessible 3-frame ASCII animation and
  conversational welcome copy that orients the user before the questionnaire
  starts. The animation is automatically skipped when stdout is not a TTY,
  when `--no-color` is passed, when `--yes` is passed, or when `CI=1` is set.
  No flashing, no inverted colors, no Unicode.
- **Design Decisions questionnaire.** An opt-in 13-question, 6-group flow
  (Core Assumptions, Authentication & Access, Information Collection,
  Interaction Model, Communication & Language, Edge Cases & Intersections)
  that surfaces the real tradeoffs a product has made. Every question is
  skippable; an empty answer is a valid answer. Grounded in ABLEIST,
  recent ACM disability-in-LLM research, and Kat Holmes' _Mismatch_.
- **`update` command.** Re-runs the questionnaire against an existing
  `INCLUSION.md` and rewrites only Section 1 (Project Context) and Section
  12 (Maintenance). Everything else - including user edits - is preserved
  verbatim. Friendly error if no existing file is found.
- **Smoke tests** under `test/` using the built-in `node:test` runner.
  Covers: template loading, Section 1 + 12 replacement, Design Decisions
  injection, idempotency on re-render, preservation of user edits outside
  the rewritten sections, argument parsing, and end-to-end file write.
- **README methodology section** documenting the Design Decisions groups,
  the research grounding, and the `update` workflow. New Troubleshooting
  section covering CI usage, scripting, and edit preservation guarantees.
- **Help text** rewritten to document the `update` command, the optional
  questionnaire, scripting flags, and troubleshooting.

### Changed

- Section 1 of the rendered template is now structured as `### 1.A Overview`
  (the existing Project Context bullets) plus an optional `### 1.B Design
Decisions` subsection, populated only when the questionnaire is run.

## [0.1.0] - 2026-05-11

### Added

- Initial draft of `INCLUSION.md` template.
- `README.md` with quick start and integration notes for GitHub Copilot,
  Cursor, Claude Code, Continue, and Windsurf.
- `CONTRIBUTING.md` with ground rules and PR checklist.
- Domain examples for a frontend app, a design system, and a backend API
  under `examples/`.
- MIT License.
- Banner image and project intro by [Branon](https://branon.dev).
- Zero-dependency CLI (`npx inclusion-md init`) that interactively scaffolds
  a customized `INCLUSION.md`, picks a variant template, and prints
  next-steps integration snippets. Supports `--variant`, `--out`, `--force`,
  `--yes`, and `--no-color`.
