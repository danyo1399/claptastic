import PouchDB from 'pouchdb-browser'
import { uniqueId } from '../utils/id.utils'
import { clapperAudioUpdated, clapperCustomAudioRemoved } from './clap.events'
import { blobStorage, upsert } from '../utils/db'
import { setAudio } from './audio'

// Leave this here to migrate everyone off obsolete db migrating data and then destroying
export const clapsDb = new PouchDB('claptastic', { auto_compaction: true })

export const blobs = blobStorage(clapsDb)

function genId(id: number) {
    return uniqueId(`${id}#audio`)
}

export async function setClapperAudio(
    clapperId: number,
    name: string,
    blob: Blob,
) {
    await setAudio(clapperId, blob)

    await clapperAudioUpdated.raiseEvent({
        clapperId: clapperId,
        name: name,
        type: blob.type,
    })
}
