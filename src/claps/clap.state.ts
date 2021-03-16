import { atom, selector } from 'recoil'
import { useImmerRecoilState } from '../state/immerRecoil'
import {
    clapped,
    clapperAudioUpdated,
    clapperCustomAudioRemoved,
} from './clap.events'
import { ClapState } from './clap.models'
import getLogger from '../utils/logger'
import { ChangeHandler, EventModel, EventState } from '../events'

const logger = getLogger('clap-state')

export function defaultState(): ClapState {
    return {
        claps: [],
        clappers: [{ color: 'yellow', userAudioBlobKey: null }],
        last_seq: 0,
    }
}
const clapAtom = atom<ClapState>({
    key: 'clapAtom',
    default: defaultState(),
})

function stateActions(state: ClapState) {
    function setAudio(id: number, key) {
        const clapper = state.clappers[id]
        if (clapper) {
            clapper.userAudioBlobKey = key
        }
    }

    function removeAudio(id: number) {
        const clapper = state.clappers[id]
        clapper.userAudioBlobKey = null
    }
    return { removeAudio, setAudio: setAudio }
}

export const clapReducer: ChangeHandler = (
    change: PouchDB.Core.ChangesResponseChange<EventModel<any>>,
    state: any,
) => {
    clapperCustomAudioRemoved.applyEvent(change, (ev) => {
        stateActions(state).removeAudio(ev.doc.data.clapperId)
    })

    clapped.applyEvent(change, (ev) => {
        state.claps.push(ev.doc.data)
    })

    clapperAudioUpdated.applyEvent(change, (x) => {
        const data = x.doc.data
        stateActions(state).setAudio(data.clapperId, data.key)
    })
}

export default clapAtom

export const clappersSelector = selector({
    key: 'clappersSelector',
    get: ({ get }) => {
        return get(clapAtom).clappers
    },
})
