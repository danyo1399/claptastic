import getLogger from './logger'
import { createEventEmitter } from './events'

export interface QueueEntry {
    fn: () => Promise<any>
    key: string
}

// used to serialise execution of async code running outside async context
export function createQueueProcessor() {
    const queue: { [id: number]: QueueEntry } = {}
    let addIndex = 0
    let processIndex = 0
    let processing = false
    const eventEmitter = createEventEmitter()
    const logger = getLogger('queue-processor')

    async function enqueue(entry: QueueEntry) {
        if (!entry) {
            throw new Error('null ref queue entry')
        }
        queue[addIndex] = entry
        addIndex++
        //logger.debug("queue", Object.values(queue));
        await process()
    }

    async function process() {
        if (processing) return

        processing = true
        while (processIndex < addIndex) {
            try {
                await queue[processIndex].fn()
            } catch (err) {
                logger.error('error handling queue event. What can we do?', {
                    key: queue[processIndex].key,
                    err,
                })
            } finally {
                delete queue[processIndex]
                processIndex++
            }
        }
        eventEmitter.dispatch()
        processing = false
    }

    async function waitTillEmpty() {
        if (processing) {
            await new Promise((resolve) => {
                const handle = () => {
                    eventEmitter.removeEventListener(handle)
                    resolve(undefined)
                }
                eventEmitter.addEventListener(handle)
            })
        }
        return
    }

    return { enqueue, waitTillEmpty }
}
