const ERROR_MSG_COLOR = 31; // red
const WIN_MSG_COLOR = 32; // green

const display = (msg, color = 0) =>
  console.log(`\x1b[${color}m${msg}\x1b[0m`);

const displayError = (msg) =>
  display(msg, ERROR_MSG_COLOR);

const displayWin = (msg) =>
  display(msg, WIN_MSG_COLOR);

module.exports.display = display;
module.exports.displayError = displayError;
module.exports.displayWin = displayWin;
