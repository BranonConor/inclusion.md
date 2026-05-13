"use strict";

const fs = require("fs");
const path = require("path");

const c = require("./colors");
const { createPrompter } = require("./prompt");
const { loadTemplate, renderGeneric, VARIANTS } = require("./template");

const BANNER = `
${c.magenta(c.bold("INCLUSION.md"))} ${c.dim("scaffolder")}
${c.dim("An LLM/agent context convention for model biases - https://github.com/BranonConor/inclusion.md")}
`;

async function init(args) {
  c.set(args.color);

  process.stdout.write(BANNER + "\n");
  process.stdout.write(
    c.dim(
      "I'll ask a few questions about your project, then write a customized\n" +
        "INCLUSION.md to disk. Press Ctrl+C any time to bail.\n"
    ) + "\n"
  );

  const p = createPrompter({ acceptDefaults: !!args.yes });

  try {
    // --- variant ----------------------------------------------------------
    let variant = args.variant;
    if (!variant) {
      variant = await p.choice(
        "Which template do you want to start from?",
        [
          { value: "generic", label: "Generic", hint: "Default. Good for most repos." },
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
        { default: 0 }
      );
    }
    if (!VARIANTS[variant]) {
      throw new Error(
        `Unknown variant "${variant}". Choose one of: ${Object.keys(VARIANTS).join(", ")}.`
      );
    }

    process.stdout.write("\n" + c.bold("Project context") + "\n");
    process.stdout.write(
      c.dim(
        "These answers fill in Section 1. Be specific - generic answers make for generic guidance.\n"
      ) + "\n"
    );

    const product = await p.text("What does this project do?", {
      default: "A short description of what this software does.",
    });
    const primaryUsers = await p.text("Who have you intentionally designed for?", {
      default: "Describe your primary users.",
    });
    const underservedUsers = await p.text(
      "Who do you know you haven't designed for well yet?",
      {
        default:
          "Document a real gap here (e.g. screen reader users on the dashboard; Spanish-language onboarding).",
      }
    );
    const distribution = await p.text(
      "Where is this software used? (geography, devices, network, assistive tech)",
      {
        default:
          "Web/iOS/Android, primary regions, languages, common assistive technologies.",
      }
    );
    const stakes = await p.text(
      "What happens when this software excludes someone?",
      {
        default:
          "Describe the real-world cost of exclusion (loss of access to healthcare, employment, civic services, etc.).",
      }
    );

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
      { default: 1 }
    );
    const feedback = await p.text(
      "How can users and contributors report exclusionary patterns?",
      {
        default:
          "Open an issue on this repository, or contact the owner directly.",
      }
    );

    // --- output path ------------------------------------------------------
    const outPath = path.resolve(
      process.cwd(),
      args.out || "INCLUSION.md"
    );

    if (fs.existsSync(outPath) && !args.force) {
      const overwrite = await p.confirm(
        `${path.relative(process.cwd(), outPath) || outPath} already exists. Overwrite?`,
        { default: false }
      );
      if (!overwrite) {
        process.stdout.write(
          c.yellow("\nAborted. ") + "Existing file left untouched.\n"
        );
        p.close();
        return;
      }
    }

    // --- render -----------------------------------------------------------
    const template = loadTemplate(variant);
    const answers = {
      product,
      primaryUsers,
      underservedUsers,
      distribution,
      stakes,
      owner,
      cadence,
      feedback,
    };

    let rendered;
    if (variant === "generic") {
      rendered = renderGeneric(template, answers);
    } else {
      rendered = prependPersonalizedContext(template, answers);
    }

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, rendered, "utf8");

    p.close();

    const rel = path.relative(process.cwd(), outPath) || outPath;
    process.stdout.write(
      "\n" +
        c.green("✓ ") +
        c.bold(`Wrote ${rel}`) +
        c.dim(` (${formatBytes(Buffer.byteLength(rendered))})`) +
        "\n\n"
    );

    printNextSteps(rel);
  } finally {
    p.close();
  }
}

function prependPersonalizedContext(template, answers) {
  // For non-generic variants, the canonical template already has its own
  // Section 1. We replace it with the user's answers.
  return renderGeneric(template, answers);
}

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
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
      `  3. Commit it. Treat it like the rest of your engineering docs.\n\n` +
      c.dim(
        "Companion essay: https://branon.dev/blog/posts/the-need-for-inclusion-md\n"
      )
  );
}

module.exports = { init };
