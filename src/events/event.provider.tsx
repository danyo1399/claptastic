import { getEventChanges } from './events.db'
import { useEffect } from 'react'
import getLogger from '../utils/logger'
import { ChangeHandler, EventModel, EventState } from './events'

const logger = getLogger('events')

export function EventHandlerProvider({
    handlers,
    initialState,
    setState,
}: {
    handlers: ChangeHandler[]
    initialState: EventState
    setState: (state: any) => void
}) {
    useEffect(() => {
        ;(async () => {
            function handleChange(
                change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>,
                handleState: any,
            ) {
                for (const handler of handlers) {
                    logger.debug('event:' + change.doc.type, change)

                    handler(change, handleState)
                }
                handleState.last_seq = change.seq as number
            }

            await getEventChanges(
                { live: false, return_docs: false },
                (change) => {
                    handleChange(change, initialState)
                },
            )
            setState(() => initialState)
            logger.log('last seq', initialState.last_seq)
            await getEventChanges(
                {
                    live: true,
                    return_docs: false,
                    since: initialState.last_seq,
                },
                (change) => {
                    setState((state) => {
                        handleChange(change, state)
                    })
                },
            )
        })()
    }, [])
    return null
}
