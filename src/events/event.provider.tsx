import { ChangeHandler, getEventChanges } from './events.db';
import React, { useEffect } from 'react';
import getLogger from '../utils/logger';

const logger = getLogger('events');
export function EventHandlerProvider({ handlers }: { handlers: ChangeHandler[] }) {
  useEffect(() => {
    function handleChange(change) {
      for (const handler of handlers) {
        logger.debug('event:' + change.doc.type, change);

        handler(change);
      }
    }

    getEventChanges({ live: true, return_docs: false }, (change) => {
      handleChange(change);
    });
  }, []);
  return null;
}
