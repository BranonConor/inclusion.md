"use strict";

const readline = require("readline");
const c = require("./colors");

function createPrompter({ acceptDefaults = false } = {}) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdout.isTTY,
  });

  rl.on("SIGINT", () => {
    rl.close();
    const err = new Error("Cancelled by user");
    err.code = "USER_CANCELLED";
    throw err;
  });

  function ask(question) {
    return new Promise((resolve, reject) => {
      rl.question(question, (answer) => resolve(answer));
      rl.once("close", () => {
        const err = new Error("Cancelled by user");
        err.code = "USER_CANCELLED";
        reject(err);
      });
    });
  }

  function fmtDefault(d) {
    if (d === undefined || d === null || d === "") return "";
    return c.dim(` (${d})`);
  }

  async function text(label, { default: def = "", required = false } = {}) {
    if (acceptDefaults) return def;
    while (true) {
      const raw = await ask(
        `${c.cyan("?")} ${c.bold(label)}${fmtDefault(def)}: `,
      );
      const val = (raw || "").trim();
      if (val) return val;
      if (def) return def;
      if (!required) return "";
      process.stdout.write(c.yellow("  This one's required - try again.\n"));
    }
  }

  async function multiline(label, { default: def = "" } = {}) {
    if (acceptDefaults) return def;
    process.stdout.write(
      `${c.cyan("?")} ${c.bold(label)}\n` +
        c.dim("  (one item per line; empty line to finish"),
    );
    if (def)
      process.stdout.write(
        c.dim(`; press enter immediately to accept default`),
      );
    process.stdout.write(c.dim(")\n"));
    const lines = [];
    while (true) {
      const raw = await ask(c.dim("  - "));
      const val = (raw || "").trim();
      if (val === "" && lines.length === 0 && def) return def;
      if (val === "") break;
      lines.push(val);
    }
    return lines.length ? lines.map((l) => `- ${l}`).join("\n") : def;
  }

  async function choice(label, options, { default: defIndex = 0 } = {}) {
    if (acceptDefaults) return options[defIndex].value;
    process.stdout.write(`${c.cyan("?")} ${c.bold(label)}\n`);
    options.forEach((opt, i) => {
      const marker = i === defIndex ? c.green("*") : " ";
      process.stdout.write(
        `  ${marker} ${c.bold(String(i + 1))}) ${opt.label}` +
          (opt.hint ? c.dim(`  - ${opt.hint}`) : "") +
          "\n",
      );
    });
    while (true) {
      const raw = await ask(
        c.dim(`  choose 1-${options.length} `) +
          fmtDefault(defIndex + 1) +
          ": ",
      );
      const val = (raw || "").trim();
      if (val === "") return options[defIndex].value;
      const n = parseInt(val, 10);
      if (Number.isInteger(n) && n >= 1 && n <= options.length) {
        return options[n - 1].value;
      }
      process.stdout.write(
        c.yellow(`  Please enter a number 1-${options.length}.\n`),
      );
    }
  }

  async function confirm(label, { default: def = false } = {}) {
    if (acceptDefaults) return def;
    const hint = def ? "Y/n" : "y/N";
    while (true) {
      const raw = await ask(
        `${c.cyan("?")} ${c.bold(label)} ${c.dim(`(${hint})`)}: `,
      );
      const val = (raw || "").trim().toLowerCase();
      if (val === "") return def;
      if (val === "y" || val === "yes") return true;
      if (val === "n" || val === "no") return false;
      process.stdout.write(c.yellow("  Please answer y or n.\n"));
    }
  }

  function close() {
    rl.close();
  }

  return { text, multiline, choice, confirm, close };
}

module.exports = { createPrompter };
