import { getEventChanges } from './events.db'
import { useEffect } from 'react'
import getLogger from '../utils/logger'
import { ChangeHandler, EventModel, EventState } from './events'
import { createQueueProcessor } from '../utils/createQueueProcessor'

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
            let last_seq = undefined
            function handleChange(
                change: PouchDB.Core.ChangesResponseChange<EventModel<unknown>>,
                replaying: boolean,
                state: any,
            ) {
                for (const handler of handlers) {
                    logger.debug('event:' + change.doc.type, change)

                    handler(change, replaying, state)
                }
                last_seq = change.seq as number
            }

            // Hydrate existing changes when starting app.
            // We dont want to trigger react render for each change
            await getEventChanges(
                { live: false, return_docs: false },
                (change) => {
                    handleChange(change, true, initialState)
                },
            )
            setState(() => initialState)
            logger.log('last seq', initialState.last_seq)

            // once we caught up start listening and processing events as they occur
            await getEventChanges(
                {
                    live: true,
                    return_docs: false,
                    since: last_seq,
                },
                (change) => {
                    setState((state) => {
                        handleChange(change, false, state)
                    })
                },
            )
        })()
    }, [])
    return null
}
