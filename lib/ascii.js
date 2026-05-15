"use strict";

const c = require("./colors");

/**
 * Gentle 3-frame welcome animation. Conveys "coming together" via dots that
 * gradually connect. ASCII-only, no flashing, no inverted colors, no Unicode.
 *
 * Accessibility:
 * - Skipped automatically when stdout is not a TTY (CI, piped output).
 * - Skipped when --no-color is passed (color is the cue, not motion).
 * - Skipped when --yes is passed (non-interactive runs).
 * - Frames change appearance gradually (dim -> normal -> bold), not flashing.
 * - Total runtime under 1 second.
 */

const FRAMES = [
  ["   .     .     .   ", "                   ", "   .     .     .   "],
  ["   o     o     o   ", "                   ", "   o     o     o   "],
  ["   o-----o-----o   ", "         |         ", "   o-----o-----o   "],
];

function renderFrame(frame, intensity) {
  // intensity: 0 = dim, 1 = normal, 2 = bold
  const stylize = intensity === 0 ? c.dim : intensity === 2 ? c.bold : (s) => s;
  return frame.map((line) => stylize(line)).join("\n");
}

function clearFrame(lineCount) {
  for (let i = 0; i < lineCount; i++) {
    process.stdout.write("\x1b[1A\x1b[2K");
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function play({ enabled = true, frameMs = 220 } = {}) {
  if (!enabled) return;
  for (let i = 0; i < FRAMES.length; i++) {
    const intensity = i === FRAMES.length - 1 ? 2 : i;
    process.stdout.write(renderFrame(FRAMES[i], intensity) + "\n");
    if (i < FRAMES.length - 1) {
      await sleep(frameMs);
      clearFrame(FRAMES[i].length + 1);
    }
  }
}

function shouldAnimate({ noColor, yes }) {
  if (yes) return false;
  if (noColor) return false;
  if (!process.stdout.isTTY) return false;
  if (process.env.CI) return false;
  return true;
}

module.exports = { play, shouldAnimate, FRAMES };
