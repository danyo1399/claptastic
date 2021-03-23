import { uniqueId } from '../utils/id.utils'
import PouchDB from 'pouchdb-browser'
import { addEvent } from './events.db'
import { createEventEmitter } from '../utils/eventEmitter'

export interface EventModel<T> {
    _id: string
    _rev?: string
    type: string
    date: number
    data: T
}

export const eventStream = createEventEmitter<EventModel<any>>()
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

    function raiseEvent(data: T) {
        const event = create(data)
        eventStream.dispatch(event)
        return addEvent(event)
    }

    function applyEvent(
        event: PouchDB.Core.ChangesResponseChange<EventModel<T>>,
        fn: (e: PouchDB.Core.ChangesResponseChange<EventModel<T>>) => void,
    ): void {
        if (isType(event.doc)) {
            fn(event)
        }
    }

    function getData(event: EventModel<any>): T {
        if (isType(event)) {
            return event.data as T
        }
        throw new Error('event is not correct type' + event.type)
    }
    return { create, isType, raiseEvent, applyEvent, getData }
}

export type ChangeHandler<T extends EventState> = (
    change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>,
    replaying: boolean,
    state: T,
) => void

export interface EventState {
    last_seq: number
    [id: string]: any
}
