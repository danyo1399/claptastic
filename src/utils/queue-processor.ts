import getLogger from "./logger";

export function queueProcessor(handler: (change) => Promise<any>) {
  let queue = {};
  let addIndex = 0;
  let processIndex = 0;
  let processing = false;

  const logger = getLogger("queue-processor");

  async function add(change) {
    queue[addIndex] = change;
    addIndex++;
    //logger.debug("queue", Object.values(queue));
    await process();
  }
  async function process() {
    if (processing) return;

    processing = true;
    while (processIndex < addIndex) {
      try {
        await handler(queue[processIndex]);
      } catch (err) {
        logger.error("error handling queue event. What can we do?", {
          item: queue[processIndex],
          err,
        });
        throw err;
      } finally {
        delete queue[processIndex];
        processIndex++;
      }
    }

    processing = false;
  }

  return { add };
}
