import { ChangeHandler, getEventChanges } from "./events.db";
import React, { useEffect } from "react";

export function EventHandlerProvider({
  handlers,
}: {
  handlers: ChangeHandler[];
}) {
  useEffect(() => {
    async function load() {
      getEventChanges({ live: true }, (change) => {
        (handlers || []).forEach((handler) => {
          handler(change);
        });
      });
    }
    load();
  }, []);
  return null;
}
