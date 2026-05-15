"use strict";

const fs = require("fs");
const path = require("path");

const c = require("./colors");
const { createPrompter } = require("./prompt");
const { loadTemplate, renderGeneric, VARIANTS } = require("./template");
const ascii = require("./ascii");
const { runQuestionnaire, TOTAL_QUESTIONS } = require("./questionnaire");

const REPO_URL = "https://github.com/BranonConor/inclusion.md";
const ESSAY_URL = "https://branon.dev/blog/posts/the-need-for-inclusion-md";

async function welcome(args) {
  c.set(args.color);
  await ascii.play({
    enabled: ascii.shouldAnimate({ noColor: !args.color, yes: args.yes }),
  });
  process.stdout.write(
    "\n" +
      c.magenta(c.bold("Welcome to the INCLUSION.md CLI!")) +
      " " +
      c.dim("(v" + require("../package.json").version + ")") +
      "\n\n",
  );
}

async function askProjectContext(p) {
  process.stdout.write(
    "\n" +
      c.bold("Project Context") +
      "\n" +
      c.dim(
        "These fill in Section 1. Be specific - generic answers make for generic guidance.\n",
      ) +
      "\n",
  );

  const product = await p.text("What does this project do?", {
    default: "A short description of what this software does.",
  });
  const primaryUsers = await p.text(
    "Who have you intentionally designed for?",
    { default: "Describe your primary users." },
  );
  const underservedUsers = await p.text(
    "Who do you know you haven't designed for well yet?",
    {
      default:
        "Document a real gap (e.g. screen reader users on the dashboard; Spanish-language onboarding).",
    },
  );
  const distribution = await p.text(
    "Where is this software used? (geography, devices, network, assistive tech)",
    {
      default:
        "Web/iOS/Android, primary regions, languages, common assistive technologies.",
    },
  );
  const stakes = await p.text(
    "What happens when this software excludes someone?",
    {
      default:
        "Describe the real-world cost (loss of access to healthcare, employment, civic services).",
    },
  );

  return { product, primaryUsers, underservedUsers, distribution, stakes };
}

async function askMaintenance(p) {
  process.stdout.write("\n" + c.bold("Maintenance") + "\n\n");
  const owner = await p.text("Who owns this file? (person or team)", {
    default: "An accountable person or team",
  });
  const cadence = await p.choice(
    "How often will this file be reviewed?",
    [
      { value: "Monthly.", label: "Monthly" },
      { value: "Quarterly.", label: "Quarterly", hint: "Recommended." },
      { value: "Twice a year.", label: "Twice a year" },
      { value: "Annually (minimum).", label: "Annually (minimum)" },
    ],
    { default: 1 },
  );
  const feedback = await p.text(
    "How can users and contributors report exclusionary patterns?",
    {
      default:
        "Open an issue on this repository, or contact the owner directly.",
    },
  );
  return { owner, cadence, feedback };
}

async function init(args) {
  await welcome(args);

  process.stdout.write(
    "Let's generate an inclusion context document for your project. There are\n" +
      "two simple parts to this:\n\n" +
      `  ${c.cyan("Part 1")}  I'll start from a foundational template with general\n` +
      `          inclusion guidance to help AI agents reason about their\n` +
      `          training-data biases.\n\n` +
      `  ${c.cyan("Part 2")}  Your turn. A short Project Context questionnaire (and an\n` +
      `          optional, deeper Design Decisions one) so I can fold your\n` +
      `          project-specific reality into the doc.\n\n` +
      "Then we're done.\n\n",
  );

  const p = createPrompter({ acceptDefaults: !!args.yes });

  try {
    const proceed = await p.confirm("Should we dive in?", { default: true });
    if (!proceed) {
      process.stdout.write(
        "\n" +
          c.cyan(
            "No worries! Come back whenever you're ready. Your future users will thank you.",
          ) +
          "\n",
      );
      p.close();
      return;
    }

    process.stdout.write(
      "\n" +
        c.green("✓ ") +
        "Awesome. Step 1: loading the foundational template + general inclusion guidance...\n",
    );

    // --- variant ----------------------------------------------------------
    let variant = args.variant;
    if (!variant) {
      variant = await p.choice(
        "Which template do you want to start from?",
        [
          {
            value: "generic",
            label: "Generic",
            hint: "Default. Good for most repos.",
          },
          {
            value: "frontend-app",
            label: "Frontend web app",
            hint: "Forms, microcopy, AI features.",
          },
          {
            value: "design-system",
            label: "Design system / component library",
            hint: "Tokens, components, RTL, density.",
          },
          {
            value: "backend-api",
            label: "Backend API / SDK",
            hint: "Schema, errors, auth, telemetry.",
          },
        ],
        { default: 0 },
      );
    }
    if (!VARIANTS[variant]) {
      throw new Error(
        `Unknown variant "${variant}". Choose one of: ${Object.keys(VARIANTS).join(", ")}.`,
      );
    }

    const projectContext = await askProjectContext(p);
    process.stdout.write(
      "\n" + c.green("✓ ") + "Great, that's the foundational context.\n",
    );

    // --- Design Decisions (opt-in) ---------------------------------------
    let designDecisions = {};
    const wantsDecisions = args.yes
      ? false
      : await p.confirm(
          `Want to also fill in the Design Decisions questionnaire? (${TOTAL_QUESTIONS} short questions, all skippable)`,
          { default: true },
        );

    if (wantsDecisions) {
      designDecisions = await runQuestionnaire(p);
      process.stdout.write(
        c.green("✓ ") + "Done. Folding your answers into the doc.\n",
      );
    }

    const maintenance = await askMaintenance(p);

    // --- output path ------------------------------------------------------
    const outPath = path.resolve(process.cwd(), args.out || "INCLUSION.md");
    const allAnswers = { ...projectContext, ...maintenance, designDecisions };

    if (fs.existsSync(outPath) && !args.force) {
      const choice = await p.choice(
        `${path.relative(process.cwd(), outPath) || outPath} already exists. What now?`,
        [
          {
            value: "update",
            label: "Update it in place",
            hint: "Keeps your edits; only rewrites Section 1 + Section 12.",
          },
          {
            value: "overwrite",
            label: "Overwrite with a fresh template",
            hint: "Discards all existing content.",
          },
          { value: "abort", label: "Cancel" },
        ],
        { default: 0 },
      );
      if (choice === "abort") {
        process.stdout.write(
          c.yellow("\nAborted. ") + "Existing file left untouched.\n",
        );
        p.close();
        return;
      }
      if (choice === "update") {
        const existing = fs.readFileSync(outPath, "utf8");
        const rendered = renderGeneric(existing, allAnswers);
        fs.writeFileSync(outPath, rendered, "utf8");
        p.close();
        printSuccess(outPath, rendered, "updated");
        return;
      }
    }

    const template = loadTemplate(variant);
    const rendered = renderGeneric(template, allAnswers);

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, rendered, "utf8");

    p.close();
    printSuccess(outPath, rendered, "wrote");
  } finally {
    p.close();
  }
}

async function update(args) {
  await welcome(args);

  const outPath = path.resolve(process.cwd(), args.out || "INCLUSION.md");
  if (!fs.existsSync(outPath)) {
    process.stdout.write(
      c.yellow("Hmm, I can't find an INCLUSION.md at ") +
        c.bold(path.relative(process.cwd(), outPath) || outPath) +
        ".\n" +
        c.dim("Run ") +
        c.cyan("npx inclusion-md init") +
        c.dim(" to create one, or pass ") +
        c.cyan("--out <path>") +
        c.dim(" to point at the right location.\n"),
    );
    process.exit(1);
  }

  process.stdout.write(
    "Updating " +
      c.bold(path.relative(process.cwd(), outPath) || outPath) +
      ".\n" +
      c.dim(
        "I'll re-ask the questionnaire and rewrite Section 1 (Project Context) + Section 12 (Maintenance).\n" +
          "Everything else - including any edits you've made - is preserved.\n",
      ) +
      "\n",
  );

  const p = createPrompter({ acceptDefaults: !!args.yes });

  try {
    const proceed = await p.confirm("Cool to proceed?", { default: true });
    if (!proceed) {
      process.stdout.write(c.yellow("\nAborted.\n"));
      p.close();
      return;
    }

    const projectContext = await askProjectContext(p);

    let designDecisions = {};
    const wantsDecisions = args.yes
      ? false
      : await p.confirm("Update the Design Decisions section too?", {
          default: true,
        });
    if (wantsDecisions) {
      designDecisions = await runQuestionnaire(p);
    }

    const maintenance = await askMaintenance(p);

    const existing = fs.readFileSync(outPath, "utf8");
    const rendered = renderGeneric(existing, {
      ...projectContext,
      ...maintenance,
      designDecisions,
    });

    fs.writeFileSync(outPath, rendered, "utf8");
    p.close();
    printSuccess(outPath, rendered, "updated");
  } finally {
    p.close();
  }
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function printSuccess(outPath, rendered, verb) {
  const rel = path.relative(process.cwd(), outPath) || outPath;
  process.stdout.write(
    "\n" +
      c.green("✓ ") +
      c.bold(`${verb === "updated" ? "Updated" : "Wrote"} ${rel}`) +
      c.dim(` (${formatBytes(Buffer.byteLength(rendered))})`) +
      "\n\n",
  );

  printNextSteps(rel);
}

function printNextSteps(file) {
  process.stdout.write(
    c.bold("Next steps") +
      "\n\n" +
      `  1. Open ${c.cyan(file)} and read through it once.\n` +
      `  2. Point your AI assistant at it:\n\n` +
      `     ${c.dim("# GitHub Copilot - .github/copilot-instructions.md")}\n` +
      `     Follow the inclusion guidance in /INCLUSION.md.\n\n` +
      `     ${c.dim("# Cursor - .cursor/rules/inclusion.md")}\n` +
      `     Always read and follow /INCLUSION.md.\n\n` +
      `     ${c.dim("# Claude Code - CLAUDE.md")}\n` +
      `     Read /INCLUSION.md and apply its review prompts.\n\n` +
      `  3. Commit it. Treat it like the rest of your engineering docs.\n` +
      `  4. Run ${c.cyan("npx inclusion-md update")} on a cadence (quarterly is a good default).\n\n` +
      c.dim(`Companion essay: ${ESSAY_URL}\n`) +
      c.dim(`Repo:             ${REPO_URL}\n`),
  );
}

module.exports = { init, update };
