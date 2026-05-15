"use strict";

const fs = require("fs");
const path = require("path");

const {
  renderDesignDecisionsMarkdown,
  hasAnyAnswers,
} = require("./questionnaire");

const VARIANTS = {
  generic: "INCLUSION.md",
  "frontend-app": "examples/frontend-app/INCLUSION.md",
  "design-system": "examples/design-system/INCLUSION.md",
  "backend-api": "examples/backend-api/INCLUSION.md",
};

function loadTemplate(variant) {
  const rel = VARIANTS[variant];
  if (!rel) {
    throw new Error(
      `Unknown variant "${variant}". Choose one of: ${Object.keys(VARIANTS).join(", ")}.`,
    );
  }
  // Resolve relative to the package root (one level up from /lib).
  const base = path.resolve(__dirname, "..");
  const full = path.join(base, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Template not found at ${full}.`);
  }
  return fs.readFileSync(full, "utf8");
}

/**
 * Render the generic template by substituting Section 1 (Project Context) and
 * Section 12 (Maintenance) with the user's answers. We do a targeted block
 * replace so we don't have to maintain a parallel templating language - the
 * canonical INCLUSION.md is itself the template.
 */
function renderGeneric(template, answers) {
  let out = template;

  // --- Section 1: Project Context -----------------------------------------
  const projectContextLines = [
    `## 1. Project Context`,
    ``,
    `### 1.A Overview`,
    ``,
    `- **Product:** ${answers.product}`,
    `- **Primary users:** ${answers.primaryUsers}`,
    `- **Known underserved users:** ${answers.underservedUsers}`,
    `- **Distribution context:** ${answers.distribution}`,
    `- **Stakes:** ${answers.stakes}`,
    ``,
    `Generated code, copy, and interaction patterns should be evaluated against the`,
    `context above before being merged.`,
  ];

  const designDecisionsBlock = hasAnyAnswers(answers.designDecisions)
    ? "\n\n" + renderDesignDecisionsMarkdown(answers.designDecisions).trimEnd()
    : "";

  const newProjectContext =
    projectContextLines.join("\n") + designDecisionsBlock;

  out = replaceSection(
    out,
    /^## 1\. Project Context[\s\S]*?(?=^---\s*$)/m,
    newProjectContext + "\n\n",
  );

  // --- Section 12: Maintenance --------------------------------------------
  const newMaintenance =
    `## 12. Maintenance\n\n` +
    `- **Owner:** ${answers.owner}\n` +
    `- **Review cadence:** ${answers.cadence}\n` +
    `- **Change log:** Track meaningful changes to this file in\n` +
    `  [\`CHANGELOG.md\`](./CHANGELOG.md) or in repository releases.\n` +
    `- **Feedback:** ${answers.feedback}`;

  out = replaceSection(
    out,
    /^## 12\. Maintenance[\s\S]*?(?=^---\s*$)/m,
    newMaintenance + "\n\n",
  );

  return out;
}

function replaceSection(source, regex, replacement) {
  if (!regex.test(source)) return source;
  return source.replace(regex, replacement);
}

module.exports = { loadTemplate, renderGeneric, VARIANTS };
