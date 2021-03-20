import PouchDB from 'pouchdb-browser'
import { blobStorage } from '../utils/db'

// Leave this here to migrate everyone off obsolete db migrating data and then destroying
export const clapDb = new PouchDB('claptastic', { auto_compaction: true })

export const clapStorage = blobStorage(clapDb)
