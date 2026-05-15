![INCLUSION.md - an LLM/agent context convention for model biases](./assets/banner.png)

# inclusion.md

> A repository-level context engineering document for inclusive AI-assisted
> software development.

[**Read INCLUSION.md →**](./INCLUSION.md)

---

## Hi, I'm [Branon](https://branon.dev) 👋

I'm a design engineer who cares a lot about accessibility. As AI-assisted
development started becoming the default in how we build software, I kept
thinking about what a11y looks like in this new paradigm - where coding
assistants are quietly making thousands of small decisions about who our
software is built for.

This repo is something I feel is currently missing from the conversation. As
AI agents increasingly step into the roles of designers and engineers, I feel
they need to be made aware of their biases from the data they're trained on -
much like humans need to be made aware of biases in our cognitive schemas
and our unique understandings of the world. `INCLUSION.md` is a small,
opinionated, machine-readable scaffold for doing exactly that: giving AI
coding assistants persistent inclusion-oriented guidance during code
generation.

For the full rationale - training-data bias, the limits of WCAG, why
inclusion needs an operational layer in AI-native workflows - read the
companion essay: [_The need for INCLUSION.md_](https://branon.dev/blog/posts/the-need-for-inclusion-md).

---

## What it is

`INCLUSION.md` is a drop-in file that gives AI coding assistants - GitHub
Copilot, Cursor, Claude Code, Windsurf, Continue, and friends - persistent,
inclusion-oriented guidance during code generation.

It is the inclusion-focused sibling of `A11Y.md`, `CONTRIBUTING.md`, and
`design.md`:

| File              | Operationalizes                                        |
| ----------------- | ------------------------------------------------------ |
| `README.md`       | What this project is                                   |
| `CONTRIBUTING.md` | How humans contribute                                  |
| `A11Y.md`         | Technical accessibility compliance                     |
| `design.md`       | Visual and interaction system                          |
| `INCLUSION.md`    | Contextual, representational, sociotechnical inclusion |

---

## Why this exists

AI-assisted development is becoming infrastructure. Coding assistants now sit
_between_ human intent and the code, copy, and interactions that ship. They
generate output based on what is statistically likely given their training
data - and that training data carries the accumulated biases of the public
web, open-source code, and English-language text.

That means AI assistants can quietly amplify two kinds of debt at once:

- **Accessibility debt** - inaccessible patterns inherited from the public web.
- **Representational debt** - narrow assumptions about whose communication
  styles, identities, and lived experiences count as "default."

Neither shows up in your bundle size report.

`INCLUSION.md` is a small, opinionated, machine-readable scaffold to push back
on that flattening. It is not a fix. Bias mitigation is an unresolved
sociotechnical problem. But operational scaffolding lowers the floor.

---

## Quick start

### Option A: Use the CLI (recommended)

```bash
npx inclusion-md init
```

That's it. The CLI walks you through a few questions about your project
(product, primary users, known underserved users, distribution context,
stakes, ownership, review cadence), picks a starting template (generic,
frontend app, design system, or backend API), and writes a customized
`INCLUSION.md` to your repo root.

Useful flags:

```bash
npx inclusion-md init --variant design-system    # start from a domain example
npx inclusion-md init --out docs/INCLUSION.md    # write somewhere else
npx inclusion-md init --yes                      # accept defaults, non-interactive
npx inclusion-md init --force                    # overwrite without prompting
npx inclusion-md update                          # re-run questionnaire on existing file
npx inclusion-md --help
```

Requires Node.js 16+. No dependencies.

#### The Design Decisions questionnaire

After the foundational questions, the CLI offers an opt-in **Design Decisions**
questionnaire - 13 short, skippable questions across six groups:

1. **Core assumptions** - who you primarily build for, and what "default user"
   assumptions live inside your product
2. **Authentication & access** - how people get in, who can't, why
3. **Information collection** - what you ask for, what's required, why
4. **Interaction model** - how people interact, what patterns you don't support
5. **Communication & language** - languages and tone you optimize for
6. **Edge cases & intersections** - where the product breaks, who shows up
   in unexpected ways

The questions are grounded in three sources:

- _ABLEIST: Measuring Ableist Harms in LLMs_ ([arxiv.org/abs/2510.10998](https://arxiv.org/abs/2510.10998))
- _Centering Disability Perspectives in LLM Research and Design_ (ACM)
- Kat Holmes, _Mismatch: How Inclusion Shapes Design_ (MIT Press)

The point isn't perfect answers. The point is **conscious, documented
tradeoffs**. Skipping a question is a valid answer; the doc just won't speak
to that dimension yet. Run `npx inclusion-md update` later to fill more in.

Answers land in your `INCLUSION.md` as a `### 1.B Design Decisions` subsection
under Project Context. Reviewers (human and AI) can flag generated output that
contradicts the realities you've documented.

#### Updating an existing INCLUSION.md

```bash
npx inclusion-md update
```

This re-runs the Project Context + Design Decisions + Maintenance questions
and rewrites **only** Sections 1 and 12 in place. Any edits you've made to
the rest of the file - your engineering guidance, your language heuristics,
your custom sections - are preserved.

### Option B: Copy the file by hand

```bash
curl -O https://raw.githubusercontent.com/BranonConor/inclusion.md/main/INCLUSION.md
```

Or just download [`INCLUSION.md`](./INCLUSION.md) from this repo and drop it
into the root of your project alongside `README.md`.

### Customize Section 1 (Project Context)

The generic template is a starting point. Inclusion guidance is _contextual_ -
the section that matters most is the one that describes _your_ product, _your_
users, and _your_ known blind spots. Fill in:

- the product description
- who you've designed for
- who you _haven't_ designed for well (yet)
- distribution context (geography, devices, languages, assistive tech)
- the stakes when exclusion happens

(If you used `npx inclusion-md init`, this is already filled in.)

### Reference it from your AI assistant

Most AI coding assistants support repository-level context files. Point them
at `INCLUSION.md`.

**GitHub Copilot** - create `.github/copilot-instructions.md`:

```md
This repository contains an `INCLUSION.md` at the project root.
Follow its guidance when generating UI copy, code, documentation,
error messages, persona descriptions, and review feedback.
```

**Cursor** - in `.cursor/rules/inclusion.md` or `.cursorrules`:

```md
Always read and follow `/INCLUSION.md` when generating code, copy,
or design artifacts in this repository.
```

**Claude Code** - in `CLAUDE.md`:

```md
Read `/INCLUSION.md` and apply its review prompts before
finalizing any generated output in this repository.
```

**Continue / Windsurf / Cody / etc.** - add `INCLUSION.md` to your workspace
context configuration.

### Treat it like the rest of your engineering docs

- Name an owner.
- Review on a cadence (quarterly recommended).
- Track changes in a `CHANGELOG.md` or in releases.
- Provide a feedback route for users and contributors.

---

## Examples

The [`examples/`](./examples) folder contains adapted `INCLUSION.md` files for
different repo types:

- [`examples/frontend-app/INCLUSION.md`](./examples/frontend-app/INCLUSION.md) -
  a consumer-facing web app
- [`examples/design-system/INCLUSION.md`](./examples/design-system/INCLUSION.md) -
  a component library / design system
- [`examples/backend-api/INCLUSION.md`](./examples/backend-api/INCLUSION.md) -
  a backend API / SDK

These are illustrative, not prescriptive. Adapt them to your context.

---

## What this is not

`INCLUSION.md` is **not**:

- a substitute for participatory research with disabled users
- a substitute for hiring disabled designers, engineers, and researchers
- a substitute for accessibility audits and remediation
- a substitute for legal and regulatory compliance
- a guarantee that any AI assistant will follow its guidance
- a finished or final artifact

It is an operational scaffold. The ceiling is raised by people - especially
disabled people - with authority, budget, and time.

---

## Troubleshooting

**"`npx inclusion-md` does nothing / hangs."**
Make sure you're on Node.js 16+ (`node --version`). The CLI uses only
built-in modules - no install step is required.

**"I can't find an existing `INCLUSION.md`" when running `update`.**
By default the CLI looks at `./INCLUSION.md`. If yours lives elsewhere,
pass `--out`:

```bash
npx inclusion-md update --out docs/INCLUSION.md
```

**The welcome animation looks weird in CI.**
It's automatically skipped when stdout isn't a TTY, when `--no-color` is
passed, or when `CI=1` is set. If you're piping output, pass `--no-color`
explicitly to be safe.

**I want to script this in a setup wizard.**
Pass `--yes` to accept all defaults and skip the optional Design Decisions
questionnaire. Combine with `--variant`, `--out`, and `--force` for a fully
non-interactive run.

**I edited my `INCLUSION.md` and I'm worried `update` will trash it.**
`update` only touches Section 1 (Project Context) and Section 12
(Maintenance). Everything else is preserved verbatim. The smoke tests
([`test/smoke.test.js`](./test/smoke.test.js)) cover this contract.

---

## Contributing

Pull requests, issues, translations, domain-specific extensions, and critiques
are welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

This project takes language and representation seriously. Contributions that
improve language guidance, add domain-specific sections, or correct ableist or
exclusionary defaults are especially appreciated. Contributions from disabled
practitioners and from communities underrepresented in this kind of tooling
are prioritized in review.

---

## License

MIT. See [`LICENSE`](./LICENSE).

You are encouraged to fork, adapt, translate, and ship this in your own
projects. Attribution is appreciated but not required.

---

## Citation

If you cite this work academically or in industry writing:

```
Conor, B. (2026). INCLUSION.md: A context engineering scaffold for
inclusive AI-assisted software development. https://github.com/BranonConor/inclusion.md
```

Companion essay: _The need for INCLUSION.md_,
<https://branon.dev/blog/posts/the-need-for-inclusion-md>.
