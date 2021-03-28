// @ts-ignore
import audioFileUrl from '../media/audio.mp3'
import { clapStorage } from './clap.db'
import getLogger from '../utils/logger'
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
        await clapStorage.setItem('default-audio', blob)
        return blob
    } catch (e) {}

    return await clapStorage.getItem('default-audio')
}

async function getDefaultAudio() {
    const blob = await loadDefaultAudio()
    return URL.createObjectURL(blob)
}

export const defaultAudioUrlPromise = getDefaultAudio()

export let defaultAudioUrl: string

const audioCache: string[] = []

function createBlobKey(clapperId: number) {
    return `${clapperId}#audio`
}

export function getAudioUrl(clapperId: number): string {
    return audioCache[clapperId] || defaultAudioUrl
}

export async function setAudio(clapperId: number, file: Blob) {
    await removeAudio(clapperId)
    await clapStorage.setItem(createBlobKey(clapperId), file)
    const url = URL.createObjectURL(file)
    audioCache[clapperId] = url
}

export async function removeAudio(clapperId: number) {
    await clapStorage.deleteItem(createBlobKey(clapperId))
    const url = audioCache[clapperId]
    if (url) {
        URL.revokeObjectURL(url)
        audioCache[clapperId] = null
    }
}

async function getAudio(clapperId: number) {
    return clapStorage.getItem(createBlobKey(clapperId))
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
