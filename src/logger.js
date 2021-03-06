export default function createLogger(prefix) {
  const version = WEBPACK_VERSION;
  function log(msg, ...args) {
    console.log(`[${prefix} ${version}] ${msg}`, ...args);
  }

  function error(msg, ...args) {
    console.error(`[${prefix} ${version}] ${msg}`, ...args);
  }

  function warn(msg, ...args) {
    console.warn(`[${prefix} ${version}] ${msg}`, ...args);
  }

  function debug(msg, ...args) {
    console.debug(`[${prefix} ${version}] ${msg}`, ...args);
  }

  return { log, error, warn, debug };
}

export const { log, error, warn, debug } = createLogger("app");
