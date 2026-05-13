#!/usr/bin/env node
/* eslint-disable no-console */

const { init } = require("../lib/init");

const HELP = `inclusion-md - scaffold an INCLUSION.md for your repository.

Usage:
  npx inclusion-md init [options]
  npx inclusion-md --help

Commands:
  init                 Interactively generate an INCLUSION.md.

Options:
  -o, --out <path>     Output path (default: ./INCLUSION.md).
      --variant <name> Start from a variant template:
                       generic (default) | frontend-app | design-system | backend-api
      --force          Overwrite an existing INCLUSION.md without prompting.
      --yes            Accept defaults for any unanswered prompts.
      --no-color       Disable ANSI color output.
  -h, --help           Show this help.
  -v, --version        Show CLI version.

Examples:
  npx inclusion-md init
  npx inclusion-md init --variant design-system
  npx inclusion-md init --out docs/INCLUSION.md --force

Read more: https://github.com/BranonConor/inclusion.md
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

  if (args.command !== "init") {
    console.error(`Unknown command: ${args.command}`);
    process.stdout.write("\n" + HELP);
    process.exit(2);
  }

  try {
    await init(args);
  } catch (err) {
    if (err && err.code === "USER_CANCELLED") {
      console.error("\nCancelled. No file was written.");
      process.exit(130);
    }
    console.error("\nError:", err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
