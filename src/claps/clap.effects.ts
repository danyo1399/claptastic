import { ChangeHandler, EventModel } from '../events'
import { ClapEventData, clappedEvent } from './clap.events'
import getLogger from '../utils/logger'
import { addClap } from './clap.api'

const logger = getLogger('clap change handler')
export const clappedHandler: ChangeHandler = (change, replaying, state) => {
    const event = change.doc as EventModel<ClapEventData>
    if (replaying) {
        return
    }

    if (clappedEvent.isType(event)) {
        const data = event.data

        addClap({ userId: '', message: data.message })
    }
}
