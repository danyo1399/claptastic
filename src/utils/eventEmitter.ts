import getLogger from './logger'

const logger = getLogger('event emitter')

export function createEventEmitter<T>() {
    let id = 0
    const idProperty = '__eventEmitterId'
    const dict: any = {}

    function dispatch(data?: T) {
        Object.values<any>(dict).forEach((handler) => {
            try {
                handler(data)
            } catch (err) {
                logger.error('failed to dispatch event', { handler, err })
            }
        })
    }

    function addEventListener(handler: (event: T) => void) {
        if (!handler[idProperty]) {
            handler[idProperty] = ++id
        }
        dict[handler[idProperty]] = handler
    }

    function removeEventListener(handler: (event: T) => void) {
        delete dict[handler[idProperty]]
    }

    function getHandlers() {
        return Object.values(dict)
    }

    return { dispatch, addEventListener, removeEventListener, getHandlers }
}
