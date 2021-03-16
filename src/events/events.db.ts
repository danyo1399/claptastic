import PouchDB from 'pouchdb-browser'
import { uniqueId } from '../utils/id.utils'
import { EventModel } from './events'

const eventsDb = new PouchDB<EventModel<unknown>>('events')

export function addEvent<T>(event: EventModel<T>) {
    return eventsDb.put(event)
}

export function getEventChanges(
    options: PouchDB.Core.ChangesOptions,
    changeFn: (
        change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>,
    ) => any,
) {
    return eventsDb
        .changes({ ...options, include_docs: true })
        .on('change', changeFn)
}
