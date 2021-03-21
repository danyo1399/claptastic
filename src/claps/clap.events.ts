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

export interface ClapperEventData {
    clapperId: number
    buttonType: string
}
export const clapperCreated = createEventFn<ClapperEventData>('clapperCreated')

export const clapperCustomAudioRemovedEvent = createEventFn<{
    clapperId: number
}>('clapperCustomAudioRemoved')
