import { atom, selector } from 'recoil'
import {
    clappedEvent,
    clapperAudioUpdatedEvent,
    clapperCreated,
    clapperCustomAudioRemovedEvent,
    clapperIconChangedEvent,
    clapperRemoved,
} from './clap.events'
import { ClapState } from './clap.models'
import getLogger from '../utils/logger'
import { ChangeHandler, EventModel, EventState } from '../events'

const logger = getLogger('clap-state')

export function clapDefault(): ClapState {
    return <ClapState>{
        claps: [],
        clappers: [{ id: 0 }],
        last_seq: 0,
    }
}

export const clapAtom = atom<ClapState>({
    key: 'clapAtom',
    default: clapDefault(),
})

export const ClappersState = selector({
    key: 'ClappersState',
    get: ({ get }) => {
        const state = get(clapAtom)
        return state.clappers
    },
})
function stateActions(state: ClapState) {
    function setAudio(id: number, filename: string, audioType: string) {
        const clapper = state.clappers.find((x) => x.id === id)
        if (clapper) {
            clapper.audioFilename = filename
            clapper.audioType = audioType
        }
    }

    function setEmoji(clapperId: number, emoji: string) {
        const clapper = state.clappers.find((x) => x.id === clapperId)
        if (clapper) {
            clapper.emoji = emoji
        }
    }

    function removeAudio(id: number) {
        const clapper = state.clappers.find((x) => x.id === id)
        if (clapper) {
            clapper.audioFilename = null
            clapper.audioType = null
        }
    }

    function removeClapper(clapperId: number) {
        state.clappers = state.clappers.filter((c) => c.id !== clapperId)
    }
    return { removeAudio, setAudio, setEmoji, removeClapper }
}

export const clapReducer: ChangeHandler<ClapState> = (
    change: PouchDB.Core.ChangesResponseChange<EventModel<any>>,
    replaying,
    state: ClapState,
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

    clapperCreated.applyEvent(change, (x) => {
        const clappers = state.clappers
        let nextIdToAdd = state.clappers.length
        for (
            let potentialNextId = nextIdToAdd;
            potentialNextId < state.clappers.length;
            potentialNextId++
        ) {
            if (!clappers.some((x) => x.id === potentialNextId)) {
                nextIdToAdd = potentialNextId
                break
            }
        }
        state.clappers.push({ id: nextIdToAdd })
    })

    clapperRemoved.applyEvent(change, (x) => {
        stateActions(state).removeClapper(x.doc.data.clapperId)
    })

    clapperIconChangedEvent.applyEvent(change, (x) => {
        const { clapperId, emoji } = x.doc.data
        stateActions(state).setEmoji(clapperId, emoji)
    })
}

export const clappersSelector = selector({
    key: 'clappersSelector',
    get: ({ get }) => {
        return get(clapAtom).clappers
    },
})
