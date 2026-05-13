"use strict";

const supportsColor =
  process.stdout.isTTY &&
  process.env.TERM !== "dumb" &&
  !("NO_COLOR" in process.env);

let enabled = supportsColor;

function set(on) {
  enabled = on && supportsColor;
}

function wrap(open, close) {
  return (s) => (enabled ? `\x1b[${open}m${s}\x1b[${close}m` : String(s));
}

module.exports = {
  set,
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  italic: wrap(3, 23),
  cyan: wrap(36, 39),
  magenta: wrap(35, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  red: wrap(31, 39),
  gray: wrap(90, 39),
};
