# How it works

A reasonable concern when looking at a 400+ line markdown file: _won't this
eat my context window every prompt?_ Short answer: no, and the cost is
smaller than it looks.

## How it gets loaded, by tool

| Tool                       | How it loads `INCLUSION.md`                          | When                                           |
| -------------------------- | ---------------------------------------------------- | ---------------------------------------------- |
| GitHub Copilot Chat        | Via `.github/copilot-instructions.md` referencing it | Once per session/thread                        |
| Cursor                     | Via `.cursor/rules/inclusion.md` or `.cursorrules`   | On rule activation, often per turn for matches |
| Claude Code                | Via `CLAUDE.md` reference, then `Read` tool fetches  | On demand, agent decides                       |
| Continue / Cody / Windsurf | Workspace context file                               | Once per session                               |

The pattern across all of them: the file isn't crammed into every LLM call.
It's loaded **once into the system prompt or a context-window slot** at
session start (Copilot, Continue), or **fetched on demand** when a task
touches relevant code (Claude Code, Cursor with rules).

## Token math

A typical generated `INCLUSION.md` is roughly **4–6k tokens**. For reference:

- Modern context windows: 128k (GPT-4o), 200k (Claude Sonnet), 1M+ (Gemini 2.0)
- A single file you're editing: 500–3000 tokens
- A full chat session: usually 20–60k tokens of context

So even on a "small" 128k window, `INCLUSION.md` is **~3–5% of context
budget**. That's the same order of magnitude as a single React component
file. Worth it.

## How to think about the tradeoff

1. **Treat it like `tsconfig.json` or a lint rule set.** Infrastructure:
   loaded once, applies to everything, doesn't need to be re-introduced.
2. **The cost is per-session, not per-prompt.** Modern agents cache the
   system prompt; the second turn doesn't re-pay the upload cost.
3. **The first ~80 lines do the load-bearing work.** Sections 0–2 (what
   this is + core principle + project context) carry the main signal.
   Sections 3–13 are reference material the agent can skim or cite.
4. **You can split it later if it bloats.** A lean root `INCLUSION.md`
   that links to `docs/inclusion/*.md` deep dives is a valid pattern —
   same way `README.md` links to `CONTRIBUTING.md`.

## Honest caveats

System-prompt-style guidance is **soft pressure**, not enforcement. It
works best when:

- The agent is told to **cite specific guidance** when generating code
  ("Reference Section 7 when writing user-facing copy")
- You **review output against it** rather than expecting the agent to
  police itself perfectly
- It's paired with **automated checks** (lint rules, a11y tests) for
  things that can be checked

`INCLUSION.md` is a thinking-tool for the human reviewer as much as a
directive for the agent. Those 4–6k tokens aren't there to fill the
context window — they're there so when generated output ships an ableist
phrase or a hover-only interaction, you can point at a section number and
say _"this is the thing we already decided."_

## What this is not

`INCLUSION.md` is **not**:

- A substitute for participatory research with disabled users
- A substitute for hiring disabled designers, engineers, and researchers
- A substitute for accessibility audits and remediation
- A substitute for legal and regulatory compliance (ADA, EAA, AODA, Section
  508, EN 301 549, etc.)
- A guarantee that any AI assistant will follow its guidance
- A finished or final artifact

It is an operational scaffold. It lowers the floor. It does not raise the
ceiling. The ceiling is raised by people — especially disabled people —
with authority, budget, and time.
