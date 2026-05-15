# Getting started

The fastest path: run the CLI, answer a few questions, commit the file.

```bash
npx inclusion-md init
```

Requires Node.js 16+. No dependencies. The CLI walks you through a short
Project Context questionnaire, an opt-in deeper Design Decisions
questionnaire, and writes a customized [`INCLUSION.md`](../INCLUSION.md) to
your repo root.

## Manual install

Prefer to copy the file by hand:

```bash
curl -O https://raw.githubusercontent.com/BranonConor/inclusion.md/main/INCLUSION.md
```

Or download [`INCLUSION.md`](../INCLUSION.md) and drop it next to your
`README.md`.

## Pick a starting variant

The CLI ships four templates. Pick the one closest to your project; the
generic one is fine for most repos.

| Variant         | Best for                                   | Source                                                |
| --------------- | ------------------------------------------ | ----------------------------------------------------- |
| `generic`       | Most repos. Default.                       | [`INCLUSION.md`](../INCLUSION.md)                     |
| `frontend-app`  | Consumer web apps. Forms, microcopy, AI.   | [`examples/frontend-app`](../examples/frontend-app)   |
| `design-system` | Component libraries. Tokens, RTL, density. | [`examples/design-system`](../examples/design-system) |
| `backend-api`   | APIs / SDKs. Schema, errors, telemetry.    | [`examples/backend-api`](../examples/backend-api)     |

```bash
npx inclusion-md init --variant design-system
```

These are illustrative, not prescriptive. Adapt them.

## Customize Section 1

Inclusion guidance is contextual. The section that earns its keep is the one
that describes _your_ product, _your_ users, and _your_ known blind spots.
The CLI fills this in for you, but if you skipped it, edit Section 1 of your
generated file and answer:

- Product description
- Who you've designed for
- Who you _haven't_ designed for well yet
- Distribution context (geography, devices, languages, assistive tech)
- The stakes when exclusion happens

## Treat it like engineering infrastructure

- Name an owner.
- Review on a cadence (quarterly is a good default).
- Track changes in `CHANGELOG.md` or releases.
- Provide a feedback route for users and contributors.

## Next steps

- [Wire it into your AI assistant →](./integrations.md)
- [Full CLI reference →](./cli-reference.md)
- [How agents actually use it (and the context-window tradeoff) →](./how-it-works.md)
