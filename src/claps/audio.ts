// @ts-ignore
import audioFileUrl from '../media/audio.mp3'
import { blobs } from './clap.db'
import getLogger from '../utils/logger'
import { createQueueProcessor } from '../utils/createQueueProcessor'
import { createObjectUrl } from '../utils/objectUrl'
const numberOfAudioTracks = 3
const logger = getLogger('audio')

async function loadDefaultAudio() {
    // Noticed some odd behavior in android where if offline for certain amount of time looks like audio is
    // removed from cache?
    // store in indexdb just to be safe
    // If we have previous saved version in db, we may still live
    try {
        const response = await fetch(audioFileUrl)
        if (!response.ok) {
            logger.warn('Failed to load default audio file', audioFileUrl)
            throw response
        }

        const blob = await response.blob()
        await blobs.setItem('default-audio', blob)
        return blob
    } catch (e) {}

    return await blobs.getItem('default-audio')
}

async function getDefaultAudio() {
    const blob = await loadDefaultAudio()
    return URL.createObjectURL(blob)
}

export const defaultAudioUrlPromise = getDefaultAudio()

export let defaultAudioUrl: string

const audio = new Audio()

const processor = createQueueProcessor()

const audioCache: string[] = []

const audioEventsCache: {
    [clapperId: number]: { onplay: any; onstop: any }
} = {}

const audioPlayerCache: {
    [clapperId: number]: HTMLAudioElement
} = {}

export function setAudioEvents(clapperId: number, onplay, onstop) {
    const existingEvents = audioEventsCache[clapperId]
    if (existingEvents) {
        // TODO
        throw new Error('Yeah todo')
    }
    audioEventsCache[clapperId] = { onplay, onstop }
}

function createBlobKey(clapperId: number) {
    return `${clapperId}#audio`
}

export function getAudioUrl(clapperId: number): string {
    return audioCache[clapperId] || defaultAudioUrl
}

export async function setAudio(clapperId: number, file: Blob) {
    await removeAudio(clapperId)
    await blobs.setItem(createBlobKey(clapperId), file)
    const url = URL.createObjectURL(file)
    audioCache[clapperId] = url
}

export async function removeAudio(clapperId: number) {
    await blobs.deleteItem(createBlobKey(clapperId))
    const url = audioCache[clapperId]
    if (url) {
        URL.revokeObjectURL(url)
        audioCache[clapperId] = null
    }
}

async function getAudio(clapperId: number) {
    return blobs.getItem(createBlobKey(clapperId))
}

export async function playAudio(
    clapperId: number,
    audioPlayer: HTMLAudioElement,
) {
    const url = getAudioUrl(clapperId)
    if (audioPlayer.src !== url) {
        audioPlayer.src = url
        audioPlayer.load()
    }
    try {
        return await audioPlayer.play()
    } catch (err) {
        logger.warn('An error occurred playing audio. trying to reset', err)
        const newUrl = await reloadAudio(clapperId)
        audioPlayer.src = newUrl
        audioPlayer.load()
        return await audioPlayer.play()
    }
}

async function reloadAudio(clapperId: number): Promise<string> {
    const blob = await getAudio(clapperId)
    const newUrl = URL.createObjectURL(blob)
    const existingUrl = audioCache[clapperId]
    if (existingUrl) {
        URL.revokeObjectURL(existingUrl)
        audioCache[clapperId] = newUrl
    }
    return newUrl
}

async function loadAudio() {
    defaultAudioUrl = await defaultAudioUrlPromise
    const promises = []
    for (let i = 0; i < numberOfAudioTracks; i++) {
        promises.push(getAudio(i))
    }
    const audioBlobs = await Promise.all(promises)
    for (let i = 0; i < audioBlobs.length; i++) {
        const blob = audioBlobs[i]
        if (blob) {
            const url = URL.createObjectURL(blob)
            audioCache[i] = url
        } else {
            audioCache[i] = null
        }
    }
}

loadAudio()
