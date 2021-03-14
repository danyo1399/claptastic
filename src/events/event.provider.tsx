import { ChangeHandler, getEventChanges } from "./events.db";
import React, { useEffect } from "react";
import getLogger from "../utils/logger";
import { queueProcessor } from "../utils/queue-processor";

const logger = getLogger("events");
export function EventHandlerProvider({
  handlers,
}: {
  handlers: ChangeHandler[];
}) {
  useEffect(() => {
    async function handleChange(change) {
      for (let handler of handlers) {
        logger.debug("event:" + change.doc.type, change);

        await handler(change);
      }
    }

    const { add } = queueProcessor(handleChange);
    getEventChanges({ live: true, return_docs: false }, (change) => {
      add(change);
    });
  }, []);
  return null;
}
