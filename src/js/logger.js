// ANSI escape codes for text color
const red = '\x1b[31m'
const green = '\x1b[32m'
const yellow = '\x1b[33m'
const blue = '\x1b[34m'
const magenta = '\x1b[35m'
const cyan = '\x1b[36m'
const white = '\x1b[37m'
const reset = '\x1b[0m'

const Logger = {
  error: message => console.log( red + ">> " + message + reset ),
  warn: message => console.log( yellow + ">> " + message + reset ),
  info: message => console.log( green + ">> " + message + reset ),
  debug: message => console.log( blue + ">> " + message + reset ),
};

export default Logger;
