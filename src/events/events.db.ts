import PouchDB from "pouchdb-browser";
import { uniqueId } from "../utils/id.utils";
import { EventModel } from "./events";

const eventsDb = new PouchDB<EventModel<unknown>>("events");

export function addEvent<T>(event: EventModel<T>) {
  return eventsDb.put(event);
}

export type ChangeHandler = (
  change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>
) => void;

export function getEventChanges(
  options: PouchDB.Core.ChangesOptions,
  changeFn: (
    change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>
  ) => void
) {
  const x = eventsDb
    .changes({ ...options, include_docs: true })
    .on("change", (x) => changeFn(x));
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

  function isType(doc: EventModel<T>) {
    return doc.type === type;
  }

  function _addEvent(data: T) {
    return addEvent(create(data));
  }

  return { create, isType, addEvent: _addEvent };
}
