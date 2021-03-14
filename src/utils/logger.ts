import { isProd } from "./environment";

export default function getLogger(prefix) {
  const version = process.env.version;
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
    if (!isProd()) {
      console.debug(`[${prefix} ${version}] ${msg}`, ...args);
    }
  }

  return { log, error, warn, debug };
}

export const { log, error, warn, debug } = getLogger("app");
