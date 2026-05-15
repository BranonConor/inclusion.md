# CLI reference

```bash
npx inclusion-md <command> [options]
```

Requires Node.js 16+. Zero dependencies.

## Commands

### `init`

Interactively generate an `INCLUSION.md`. Walks through Project Context (5
questions), an opt-in Design Decisions questionnaire (13 questions), and
Maintenance (3 questions), then writes the file.

```bash
npx inclusion-md init
npx inclusion-md init --variant design-system
npx inclusion-md init --out docs/INCLUSION.md
```

### `update`

Re-run the questionnaire against an existing `INCLUSION.md`. Rewrites only
Section 1 (Project Context) and Section 12 (Maintenance) in place.
Everything else — including your edits — is preserved verbatim.

```bash
npx inclusion-md update
npx inclusion-md update --out docs/INCLUSION.md
```

## Options

| Flag               | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `-o, --out <path>` | Output path. Default: `./INCLUSION.md`.                              |
| `--variant <name>` | `generic` (default), `frontend-app`, `design-system`, `backend-api`. |
| `--force`          | Overwrite existing file without prompting.                           |
| `-y, --yes`        | Accept defaults; skip the optional Design Decisions questionnaire.   |
| `--no-color`       | Disable ANSI colors and the welcome animation.                       |
| `-h, --help`       | Show help.                                                           |
| `-v, --version`    | Show CLI version.                                                    |

## The Design Decisions questionnaire

After Project Context, the CLI offers 13 short, skippable questions across
six groups. The point isn't perfect answers — it's **conscious, documented
tradeoffs**. Skipping is valid; the doc just won't speak to that dimension
yet, and you can fill more in later with `update`.

| Group                      | Surfaces                                                  |
| -------------------------- | --------------------------------------------------------- |
| Core assumptions           | Who you build for; "default user" assumptions in product. |
| Authentication & access    | How people get in, who can't, why.                        |
| Information collection     | What you ask for; required vs. optional; why.             |
| Interaction model          | How people interact; patterns you don't support.          |
| Communication & language   | Languages and tone you optimize for.                      |
| Edge cases & intersections | Where it breaks; who shows up unexpectedly.               |

Answers land as a `### 1.B Design Decisions` subsection under Project
Context. Reviewers (human and AI) can flag generated output that
contradicts what's documented.

The questions are grounded in:

- _ABLEIST: Measuring Ableist Harms in LLMs_ — [arxiv.org/abs/2510.10998](https://arxiv.org/abs/2510.10998)
- _Centering Disability Perspectives in LLM Research and Design_ (ACM)
- Kat Holmes, _Mismatch: How Inclusion Shapes Design_ (MIT Press)

## Scripting / non-interactive use

```bash
npx inclusion-md init --yes --variant design-system --out docs/INCLUSION.md --force
```

`--yes` skips all prompts (including the optional questionnaire) and
accepts defaults. Combine with `--force` for fully unattended setup.

## Troubleshooting

**`npx inclusion-md` does nothing or hangs.**
Check `node --version` is 16 or higher.

**"I can't find an existing `INCLUSION.md`" on `update`.**
Pass `--out` to point at the right path:

```bash
npx inclusion-md update --out docs/INCLUSION.md
```

**The welcome animation looks broken in CI.**
It's auto-skipped when stdout isn't a TTY, when `--no-color` is set, or
when `CI=1`. Pass `--no-color` explicitly to be safe.

**Worried `update` will trash my edits.**
It only rewrites Sections 1 and 12. Everything else is preserved verbatim.
The smoke tests in [`test/smoke.test.js`](../test/smoke.test.js) cover
this contract.
