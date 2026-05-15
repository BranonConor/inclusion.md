#!/usr/bin/env node
/* eslint-disable no-console */

const { init, update } = require("../lib/init");

const HELP = `inclusion-md - scaffold and maintain an INCLUSION.md for your repository.

Usage:
  npx inclusion-md <command> [options]
  npx inclusion-md --help

Commands:
  init                 Interactively generate an INCLUSION.md.
                       Includes an opt-in 13-question Design Decisions
                       questionnaire that surfaces the real tradeoffs
                       your product has made.
  update               Re-run the questionnaire against an existing
                       INCLUSION.md. Rewrites Section 1 (Project Context)
                       and Section 12 (Maintenance) in place. Everything
                       else - including your edits - is preserved.

Options:
  -o, --out <path>     Output path (default: ./INCLUSION.md).
      --variant <name> Start from a variant template (init only):
                       generic (default) | frontend-app | design-system | backend-api
      --force          Overwrite an existing INCLUSION.md without prompting.
  -y, --yes            Accept defaults for any unanswered prompts.
                       Skips the optional Design Decisions questionnaire.
      --no-color       Disable ANSI color output and skip the welcome animation.
  -h, --help           Show this help.
  -v, --version        Show CLI version.

Examples:
  npx inclusion-md init
  npx inclusion-md init --variant design-system
  npx inclusion-md init --out docs/INCLUSION.md --force
  npx inclusion-md update
  npx inclusion-md update --out docs/INCLUSION.md

Troubleshooting:
  - "I can't find an existing INCLUSION.md" - run \`init\` first, or pass
    --out to point at the right path.
  - Animation looks off in CI - it's automatically skipped when stdout is
    not a TTY, when --no-color is passed, or when CI=1 is set.
  - Want to script this? Use --yes to skip prompts and accept defaults.

Read more: https://github.com/BranonConor/inclusion.md
Companion essay: https://branon.dev/blog/posts/the-need-for-inclusion-md
`;

function parseArgs(argv) {
  const args = {
    command: null,
    out: null,
    variant: null,
    force: false,
    yes: false,
    color: true,
    help: false,
    version: false,
  };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "-h" || a === "--help") args.help = true;
    else if (a === "-v" || a === "--version") args.version = true;
    else if (a === "--force") args.force = true;
    else if (a === "--yes" || a === "-y") args.yes = true;
    else if (a === "--no-color") args.color = false;
    else if (a === "-o" || a === "--out") args.out = rest[++i];
    else if (a === "--variant") args.variant = rest[++i];
    else if (!a.startsWith("-") && !args.command) args.command = a;
    else {
      console.error(`Unknown argument: ${a}`);
      process.exit(2);
    }
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    process.stdout.write(HELP);
    return;
  }
  if (args.version) {
    const pkg = require("../package.json");
    console.log(pkg.version);
    return;
  }
  if (!args.command) args.command = "init";

  const COMMANDS = { init, update };
  const handler = COMMANDS[args.command];
  if (!handler) {
    console.error(`Unknown command: ${args.command}`);
    process.stdout.write("\n" + HELP);
    process.exit(2);
  }

  try {
    await handler(args);
  } catch (err) {
    if (err && err.code === "USER_CANCELLED") {
      console.error("\nCancelled. No file was written.");
      process.exit(130);
    }
    console.error("\nError:", err && err.message ? err.message : err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { parseArgs, HELP };
