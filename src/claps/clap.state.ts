import { atom, selector } from 'recoil'
import {
    clappedEvent,
    clapperAudioUpdatedEvent,
    clapperCustomAudioRemovedEvent,
} from './clap.events'
import { ClapState } from './clap.models'
import getLogger from '../utils/logger'
import { ChangeHandler, EventModel, EventState } from '../events'

const logger = getLogger('clap-state')

export function clapDefault(): ClapState {
    return <ClapState>{
        claps: [],
        clappers: [{ color: 'yellow' }],
        last_seq: 0,
    }
}

export const clapAtom = atom<ClapState>({
    key: 'clapAtom',
    default: clapDefault(),
})

function stateActions(state: ClapState) {
    function setAudio(id: number, filename: string, audioType: string) {
        const clapper = state.clappers[id]
        if (clapper) {
            clapper.audioFilename = filename
            clapper.audioType = audioType
        }
    }

    function removeAudio(id: number) {
        const clapper = state.clappers[id]
        if (clapper) {
            clapper.audioFilename = null
            clapper.audioType = null
        }
    }
    return { removeAudio, setAudio }
}

export const clapReducer: ChangeHandler = (
    change: PouchDB.Core.ChangesResponseChange<EventModel<any>>,
    replaying,
    state: any,
) => {
    clapperCustomAudioRemovedEvent.applyEvent(change, (ev) => {
        stateActions(state).removeAudio(ev.doc.data.clapperId)
    })

    clappedEvent.applyEvent(change, (ev) => {
        state.claps.push(ev.doc.data)
    })

    clapperAudioUpdatedEvent.applyEvent(change, (x) => {
        const data = x.doc.data
        stateActions(state).setAudio(data.clapperId, data.name, data.type)
    })
}

export const clappersSelector = selector({
    key: 'clappersSelector',
    get: ({ get }) => {
        return get(clapAtom).clappers
    },
})
