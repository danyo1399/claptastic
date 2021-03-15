import getLogger from './logger'

// used to serialise execution of async code
export function createSerialisedExecutor() {
    const queue = {}
    let addIndex = 0
    let processIndex = 0
    let processing = false

    const logger = getLogger('queue-processor')

    async function add(fn: (change) => Promise<any>) {
        queue[addIndex] = fn
        addIndex++
        //logger.debug("queue", Object.values(queue));
        await process()
    }
    async function process() {
        if (processing) return

        processing = true
        while (processIndex < addIndex) {
            try {
                await queue[processIndex]()
            } catch (err) {
                logger.error('error handling queue event. What can we do?', {
                    item: queue[processIndex],
                    err,
                })
                throw err
            } finally {
                delete queue[processIndex]
                processIndex++
            }
        }

        processing = false
    }

    return { execute: add }
}
