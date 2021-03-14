import { ChangeHandler, getEventChanges } from "./events.db";
import React, { useEffect } from "react";
import { isProd } from "../utils/environment";
import getLogger from "../utils/logger";

const logger = getLogger("events");
export function EventHandlerProvider({
  handlers,
}: {
  handlers: ChangeHandler[];
}) {
  useEffect(() => {
    async function load() {
      await getEventChanges(
        { live: true, return_docs: false },
        async (change) => {
          for (let handler of handlers) {
            if (!isProd()) {
              logger.debug("event:" + change.doc.type, change);
            }
            await handler(change);
          }
        }
      );
    }
    load();
  }, []);
  return null;
}
