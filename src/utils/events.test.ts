import { createEventEmitter } from './events'

describe('events tests', function () {
    it('should do nothing with empty emitters', async function () {
        const emitter = createEventEmitter()
        emitter.dispatch('boo')
    })
    it('should emit once', async function () {
        const fn = jest.fn()
        const emitter = createEventEmitter()
        emitter.addEventListener(fn)
        emitter.dispatch('boo')
        expect(fn).toHaveBeenCalledTimes(1)
        expect(fn).toHaveBeenCalledWith('boo')
    })
    it('should remove emitter', async function () {
        const fnToKeep = jest.fn()
        const fnToRemove = jest.fn()
        const emitter = createEventEmitter()

        emitter.addEventListener(fnToRemove)
        emitter.addEventListener(fnToKeep)

        emitter.removeEventListener(fnToRemove)

        expect(emitter.getHandlers()).toHaveLength(1)
        expect(emitter.getHandlers()[0]).toBe(fnToKeep)
    })
})
