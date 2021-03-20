import { uniqueId } from './id.utils'

describe('id utils test', function () {
    it('generated unique ids', async function () {
        const map = {}
        for (let i = 0; i < 10; i++) {
            map[uniqueId('')] = uniqueId('')
        }
        console.log(Object.keys(map))
        expect(Object.keys(map)).toHaveLength(10)
    })
})
