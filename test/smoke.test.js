"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { loadTemplate, renderGeneric, VARIANTS } = require("../lib/template");
const { renderDesignDecisionsMarkdown } = require("../lib/questionnaire");
const { parseArgs } = require("../bin/inclusion-md");

test("VARIANTS contains all four expected entries", () => {
  assert.deepStrictEqual(Object.keys(VARIANTS).sort(), [
    "backend-api",
    "design-system",
    "frontend-app",
    "generic",
  ]);
});

test("loadTemplate('generic') returns a non-empty string", () => {
  const tmpl = loadTemplate("generic");
  assert.ok(tmpl.length > 1000, "template should be substantial");
  assert.ok(tmpl.includes("## 1. Project Context"));
  assert.ok(tmpl.includes("## 12. Maintenance"));
});

test("loadTemplate throws for unknown variant", () => {
  assert.throws(() => loadTemplate("nope"), /Unknown variant/);
});

test("renderGeneric replaces Section 1 and Section 12", () => {
  const tmpl = loadTemplate("generic");
  const rendered = renderGeneric(tmpl, {
    product: "Acme Tickets",
    primaryUsers: "fans on iOS in the US",
    underservedUsers: "screen-reader users on the seat map",
    distribution: "iOS, Android, Web",
    stakes: "people miss events they paid for",
    owner: "@inclusion-team",
    cadence: "Quarterly.",
    feedback: "open an issue tagged inclusion",
    designDecisions: {},
  });

  assert.ok(rendered.includes("**Product:** Acme Tickets"));
  assert.ok(rendered.includes("**Primary users:** fans on iOS in the US"));
  assert.ok(rendered.includes("**Owner:** @inclusion-team"));
  assert.ok(rendered.includes("**Review cadence:** Quarterly."));
  assert.ok(!rendered.includes("### 1.B Design Decisions"));
});

test("renderGeneric injects Design Decisions when answers provided", () => {
  const tmpl = loadTemplate("generic");
  const rendered = renderGeneric(tmpl, {
    product: "p",
    primaryUsers: "pu",
    underservedUsers: "uu",
    distribution: "d",
    stakes: "s",
    owner: "o",
    cadence: "Quarterly.",
    feedback: "f",
    designDecisions: {
      primaryAudience: "English-fluent web users",
      authMethods: "email + magic link",
    },
  });

  assert.ok(rendered.includes("### 1.B Design Decisions"));
  assert.ok(rendered.includes("English-fluent web users"));
  assert.ok(rendered.includes("email + magic link"));
  // Section 2 still present and intact:
  assert.ok(rendered.includes("## 2. Core Principle"));
});

test("renderGeneric is idempotent on update (re-renders same answers cleanly)", () => {
  const tmpl = loadTemplate("generic");
  const answers = {
    product: "p",
    primaryUsers: "pu",
    underservedUsers: "uu",
    distribution: "d",
    stakes: "s",
    owner: "o",
    cadence: "Quarterly.",
    feedback: "f",
    designDecisions: { primaryAudience: "x" },
  };
  const once = renderGeneric(tmpl, answers);
  const twice = renderGeneric(once, answers);
  assert.strictEqual(once, twice, "second render should not change content");
});

test("renderGeneric preserves user edits outside Sections 1 + 12", () => {
  const tmpl = loadTemplate("generic");
  const edited = tmpl.replace(
    "## 2. Core Principle",
    "## 2. Core Principle\n\n<!-- USER NOTE: keep this -->",
  );
  const rendered = renderGeneric(edited, {
    product: "p",
    primaryUsers: "pu",
    underservedUsers: "uu",
    distribution: "d",
    stakes: "s",
    owner: "o",
    cadence: "Quarterly.",
    feedback: "f",
    designDecisions: {},
  });
  assert.ok(rendered.includes("<!-- USER NOTE: keep this -->"));
});

test("renderDesignDecisionsMarkdown returns empty string when no answers", () => {
  assert.strictEqual(renderDesignDecisionsMarkdown({}), "");
  assert.strictEqual(renderDesignDecisionsMarkdown(null), "");
});

test("renderDesignDecisionsMarkdown skips groups whose answers are all empty", () => {
  const md = renderDesignDecisionsMarkdown({ primaryAudience: "everyone" });
  assert.ok(md.includes("**Core assumptions**"));
  assert.ok(!md.includes("**Authentication & access**"));
});

test("parseArgs: bare command defaults handled by main", () => {
  const args = parseArgs(["node", "inclusion-md"]);
  assert.strictEqual(args.command, null);
});

test("parseArgs: init with options", () => {
  const args = parseArgs([
    "node",
    "inclusion-md",
    "init",
    "--variant",
    "design-system",
    "-o",
    "docs/INCLUSION.md",
    "--force",
    "--no-color",
  ]);
  assert.strictEqual(args.command, "init");
  assert.strictEqual(args.variant, "design-system");
  assert.strictEqual(args.out, "docs/INCLUSION.md");
  assert.strictEqual(args.force, true);
  assert.strictEqual(args.color, false);
});

test("parseArgs: update with --yes shortcut", () => {
  const args = parseArgs(["node", "inclusion-md", "update", "-y"]);
  assert.strictEqual(args.command, "update");
  assert.strictEqual(args.yes, true);
});

test("parseArgs: --help and --version flags", () => {
  assert.strictEqual(parseArgs(["node", "x", "-h"]).help, true);
  assert.strictEqual(parseArgs(["node", "x", "--help"]).help, true);
  assert.strictEqual(parseArgs(["node", "x", "-v"]).version, true);
});

test("end-to-end: render + write to a temp file", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "inclusion-md-"));
  const out = path.join(dir, "INCLUSION.md");
  const tmpl = loadTemplate("generic");
  const rendered = renderGeneric(tmpl, {
    product: "p",
    primaryUsers: "pu",
    underservedUsers: "uu",
    distribution: "d",
    stakes: "s",
    owner: "o",
    cadence: "Quarterly.",
    feedback: "f",
    designDecisions: {},
  });
  fs.writeFileSync(out, rendered, "utf8");
  const written = fs.readFileSync(out, "utf8");
  assert.ok(written.includes("**Product:** p"));
  fs.rmSync(dir, { recursive: true, force: true });
});
