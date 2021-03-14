import PouchDB from 'pouchdb-browser';
import { uniqueId } from '../utils/id.utils';
import { EventModel } from './events';

const eventsDb = new PouchDB<EventModel<unknown>>('events');

export function addEvent<T>(event: EventModel<T>) {
  return eventsDb.put(event);
}

export type ChangeHandler = (change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>) => void;

export function getEventChanges(
  options: PouchDB.Core.ChangesOptions,
  changeFn: (change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>) => any,
) {
  const x = eventsDb.changes({ ...options, include_docs: true }).on('change', changeFn);
  return x;
}

export function createEventFn<T>(type: string) {
  function create(data: T) {
    return {
      _id: uniqueId(type),
      date: Date.now(),
      data,
      type,
    };
  }

  function isType(event: EventModel<T>) {
    return event.type === type;
  }

  function _raiseEvent(data: T) {
    return addEvent(create(data));
  }

  function applyEvent(event: EventModel<T>, fn: (e: EventModel<T>) => void): void {
    if (isType(event)) {
      fn(event);
    }
  }

  return { create, isType, raiseEvent: _raiseEvent, applyEvent };
}
