import { createSerialisedExecutor } from './create-serialised-executor'

describe('queue-processor tests', function () {
    it('processes single item', async function () {
        const fn = jest.fn()
        const { execute } = createSerialisedExecutor()
        execute(fn)

        await new Promise((resolve) => setTimeout(resolve, 500))

        expect(fn).toHaveBeenCalledTimes(1)
    })

    it('processes multiple items', async function () {
        const fn = jest.fn()
        const { execute } = createSerialisedExecutor()
        execute(fn)
        execute(fn)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('processes multiple items with thread sleep between', async function () {
        const fn = jest.fn()
        const { execute } = createSerialisedExecutor()
        execute(fn)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        execute(fn)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        expect(fn).toHaveBeenCalledTimes(2)
    })
})
