import PouchDB from 'pouchdb-browser'
import { EventModel } from './events'

const eventDb = new PouchDB<EventModel<unknown>>('events')

export function addEvent<T>(event: EventModel<T>) {
    return eventDb.put(event)
}

export function getEventChanges(
    options: PouchDB.Core.ChangesOptions,
    changeFn: (
        change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>,
    ) => any,
) {
    return eventDb
        .changes({ ...options, include_docs: true })
        .on('change', changeFn)
}
