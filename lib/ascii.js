"use strict";

const c = require("./colors");

/**
 * Animated INCLUSION.md wordmark. The letters wipe in from left to right,
 * then settle from dim to bold.
 *
 * Accessibility:
 * - Skipped automatically when stdout is not a TTY (CI, piped output).
 * - Skipped when --no-color is passed (intensity is the cue).
 * - Skipped when --yes is passed (non-interactive runs).
 * - No flashing, no inverted colors, no decorative color. Motion is a
 *   single left-to-right reveal under 1 second total.
 * - Uses Unicode block characters; terminals without block-drawing glyph
 *   support will see boxes instead of letters but the CLI still works.
 */

// "INCLUSION.md" wordmark, 3 rows tall, 73 columns wide.
const ART = [
  "██ ███  ██ ▄█████ ██     ██  ██ ▄█████ ██ ▄████▄ ███  ██   ▄▄   ▄▄ ▄▄▄▄ ",
  "██ ██ ▀▄██ ██     ██     ██  ██ ▀▀▀▄▄▄ ██ ██  ██ ██ ▀▄██   ██▀▄▀██ ██▀██",
  "██ ██   ██ ▀█████ ██████ ▀████▀ █████▀ ██ ▀████▀ ██   ██ ▄ ██   ██ ████▀",
];

const ART_WIDTH = ART[0].length;
const ART_LINES = ART.length + 2; // includes 1 blank line top + bottom

function stylize(s, intensity) {
  // intensity: 0 = dim, 1 = normal, 2 = bold
  if (intensity === 0) return c.dim(s);
  if (intensity === 2) return c.bold(s);
  return s;
}

function renderRevealed(width, intensity) {
  const lines = ART.map((line) => {
    const visible = line.slice(0, width);
    const padded = visible.padEnd(ART_WIDTH, " ");
    return stylize(padded, intensity);
  });
  return ["", ...lines, ""].join("\n");
}

function clearLines(n) {
  for (let i = 0; i < n; i++) {
    process.stdout.write("\x1b[1A\x1b[2K");
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function play({ enabled = true, frameMs = 70 } = {}) {
  if (!enabled) {
    // Static render so non-animated runs aren't blank.
    process.stdout.write(renderRevealed(ART_WIDTH, 2) + "\n");
    return;
  }

  // Phase 1: column-wipe reveal in 6 steps, dim.
  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    const w = Math.ceil((ART_WIDTH * i) / steps);
    process.stdout.write(renderRevealed(w, 0) + "\n");
    await sleep(frameMs);
    clearLines(ART_LINES + 1);
  }

  // Phase 2: settle — full art, normal then bold.
  process.stdout.write(renderRevealed(ART_WIDTH, 1) + "\n");
  await sleep(120);
  clearLines(ART_LINES + 1);
  process.stdout.write(renderRevealed(ART_WIDTH, 2) + "\n");
}

function shouldAnimate({ noColor, yes }) {
  if (yes) return false;
  if (noColor) return false;
  if (!process.stdout.isTTY) return false;
  if (process.env.CI) return false;
  return true;
}

// Back-compat: previous versions exported FRAMES.
module.exports = { play, shouldAnimate, ART, FRAMES: [ART, ART, ART] };
