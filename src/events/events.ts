import { uniqueId } from '../utils/id.utils'
import PouchDB from 'pouchdb-browser'
import { addEvent } from './events.db'

export interface EventModel<T> {
    _id: string
    _rev?: string
    type: string
    date: number
    data: T
}

export function createEventFn<T>(type: string) {
    function create(data: T) {
        return {
            _id: uniqueId(type),
            date: Date.now(),
            data,
            type,
        }
    }

    function isType(event: EventModel<T>) {
        return event.type === type
    }

    function _raiseEvent(data: T) {
        return addEvent(create(data))
    }

    function applyEvent(
        event: PouchDB.Core.ChangesResponseChange<EventModel<T>>,
        fn: (e: PouchDB.Core.ChangesResponseChange<EventModel<T>>) => void,
    ): void {
        if (isType(event.doc)) {
            fn(event)
        }
    }

    return { create, isType, raiseEvent: _raiseEvent, applyEvent }
}

export type ChangeHandler = (
    change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>,
    state: EventState,
) => void

export interface EventState {
    last_seq: number
    [id: string]: any
}
