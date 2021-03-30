import { createEventFn } from '../events'

export interface ClapEventData {
    lat?: number
    long?: number
    message?: string
}

export const clappedEvent = createEventFn<ClapEventData>('CLAPPED')

export interface ClapperAudioEventData {
    clapperId: number
    name: string
    type: string
}
export const clapperAudioUpdatedEvent = createEventFn<ClapperAudioEventData>(
    'clapperAudioUpdated',
)

// export interface ClapperEventData {}
export const clapperCreated = createEventFn<any>('clapperCreated')

export interface ClapperRemovedEventData {
    clapperId: number
}
export const clapperRemoved = createEventFn<ClapperRemovedEventData>(
    'clapperRemoved',
)

export const clapperCustomAudioRemovedEvent = createEventFn<{
    clapperId: number
}>('clapperCustomAudioRemoved')

export const clapperIconChangedEvent = createEventFn<{
    clapperId: number
    emoji?: string
}>('clapperIconChanged')
