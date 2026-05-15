![INCLUSION.md - an LLM/agent context convention for model biases](./assets/banner.png)

# inclusion.md

> A repository-level context engineering document for inclusive AI-assisted
> software development.

[**Read INCLUSION.md →**](./INCLUSION.md) · [npm](https://www.npmjs.com/package/inclusion-md) · [companion essay](https://branon.dev/blog/posts/the-need-for-inclusion-md)

---

## What it is

`INCLUSION.md` is a drop-in file that gives AI coding assistants — GitHub
Copilot, Cursor, Claude Code, Windsurf, Continue, and friends — persistent,
inclusion-oriented guidance during code generation.

It's the inclusion-focused sibling of `A11Y.md`, `CONTRIBUTING.md`, and
`design.md`:

| File              | Operationalizes                                        |
| ----------------- | ------------------------------------------------------ |
| `README.md`       | What this project is                                   |
| `CONTRIBUTING.md` | How humans contribute                                  |
| `A11Y.md`         | Technical accessibility compliance                     |
| `design.md`       | Visual and interaction system                          |
| `INCLUSION.md`    | Contextual, representational, sociotechnical inclusion |

## Why it exists

AI coding assistants now sit _between_ human intent and the code, copy, and
interactions that ship. They generate output based on what's statistically
likely given training data — which carries the accumulated biases of the
public web, open-source code, and English-language text. That means
assistants quietly amplify two kinds of debt:

- **Accessibility debt** — inaccessible patterns inherited from the public web.
- **Representational debt** — narrow assumptions about whose communication
  styles, identities, and lived experiences count as "default."

Neither shows up in your bundle size report. `INCLUSION.md` is a small,
opinionated scaffold to push back. Not a fix — bias mitigation is unsolved —
but operational scaffolding that lowers the floor.

For the long version, read the companion essay:
[_The need for INCLUSION.md_](https://branon.dev/blog/posts/the-need-for-inclusion-md).

---

## Quick start

```bash
npx inclusion-md init
```

That's it. Node.js 16+ required, zero dependencies. The CLI walks you
through a short questionnaire and writes a customized `INCLUSION.md` to
your repo root. Then [point your AI assistant at it](./docs/integrations.md).

## Documentation

| Doc                                                | What's in it                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------- |
| [Getting started](./docs/getting-started.md)       | Install, pick a variant, customize Section 1, treat as infrastructure.|
| [AI assistant integrations](./docs/integrations.md)| Wire it into Copilot, Cursor, Claude Code, Continue, Windsurf.        |
| [CLI reference](./docs/cli-reference.md)           | All commands, flags, the Design Decisions questionnaire, troubleshooting. |
| [How it works](./docs/how-it-works.md)             | How agents load it, the context-window tradeoff, what this is _not_.  |
| [Examples](./examples)                             | Adapted templates: frontend app, design system, backend API.          |

---

## Hi, I'm [Branon](https://branon.dev) 👋

I'm a design engineer who cares a lot about accessibility. As AI-assisted
development became the default for shipping software, I kept thinking about
what a11y looks like in this new paradigm — where coding assistants are
quietly making thousands of small decisions about who our software is built
for. This repo is something I felt was missing from the conversation.

---

## Contributing

Pull requests, issues, translations, domain-specific extensions, and
critiques are welcome. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

This project takes language and representation seriously. Contributions
that improve language guidance, add domain-specific sections, or correct
ableist or exclusionary defaults are especially appreciated. Contributions
from disabled practitioners and from communities underrepresented in this
kind of tooling are prioritized in review.

## License & citation

MIT — see [`LICENSE`](./LICENSE). Fork, adapt, translate, ship.

If you cite this academically or in industry writing:

```
Conor, B. (2026). INCLUSION.md: A context engineering scaffold for
inclusive AI-assisted software development. https://github.com/BranonConor/inclusion.md
```
