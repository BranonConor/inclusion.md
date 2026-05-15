# AI assistant integrations

`INCLUSION.md` only does its job if your assistant actually reads it. Most
tools support repository-level context files — point them at it.

## GitHub Copilot

Create `.github/copilot-instructions.md`:

```md
This repository contains an `INCLUSION.md` at the project root.
Follow its guidance when generating UI copy, code, documentation,
error messages, persona descriptions, and review feedback.
```

## Cursor

Create `.cursor/rules/inclusion.md` (or use `.cursorrules`):

```md
Always read and follow `/INCLUSION.md` when generating code, copy,
or design artifacts in this repository.
```

## Claude Code

In `CLAUDE.md`:

```md
Read `/INCLUSION.md` and apply its review prompts before
finalizing any generated output in this repository.
```

## Continue / Windsurf / Cody / others

Add `INCLUSION.md` to your workspace context configuration. Most tools have
a "context files" or "rules" setting that takes a path or glob.

## How loading actually works

The mechanics differ per tool — see [how it works](./how-it-works.md) for
the loading model and the context-window tradeoff.

## Going further

Tell the assistant to **cite specific guidance** when generating code, e.g.
"Reference Section 7 (Inclusive Language Heuristics) when writing
user-facing copy." Specific citations work better than blanket "follow the
inclusion file" instructions.
