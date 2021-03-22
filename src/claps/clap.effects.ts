import { eventStream } from '../events'
import { clappedEvent } from './clap.events'
import getLogger from '../utils/logger'
import { addClap } from './clap.api'

const logger = getLogger('clap change handler')

eventStream.addEventListener((event) => {
    if (clappedEvent.isType(event)) {
        const data = event.data

        addClap({ userId: '', message: data.message })
    }
})
