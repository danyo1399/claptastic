import nano from 'nano'
import { Doc, Summary } from './models'
const { COUCHDB_USER, COUCHDB_PASSWORD, COUCHDB_SERVER } = process.env

const url = `http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${COUCHDB_SERVER}`
console.log('Connecting to ' + COUCHDB_SERVER)
const _nano = nano({
    url,
})
const db = _nano.db

export async function setupDb() {
    const dbs = await db.list()
    if (dbs.indexOf('claptastic-public') === -1) {
        await db.create('claptastic-public')
    }

    if (dbs.indexOf('_users') === -1) {
        await db.create('_users')
    }

    if (dbs.indexOf('_replicator') === -1) {
        await db.create('_replicator')
    }

    if (dbs.indexOf('claptastic') === -1) {
        await db.create('claptastic')
    }

    const clapDb = db.use<any>('claptastic')
    const clapDbPublic = db.use<any>('claptastic-public')
    const summary = await tryGet(clapDbPublic, 'summary')
    if (!summary) {
        await upsert(clapDbPublic, {
            count: 0,
            _id: 'summary',
        } as Summary)
    }
    console.log('summary', summary)
    return { clapDb, clapDbPublic }
}

export async function upsert(db: nano.DocumentScope<any>, doc: Doc) {
    const existing = await tryGet(db, doc._id)
    if (!existing) {
        await db.insert(doc)
    } else {
        await db.insert({ ...doc, _id: existing._id, _rev: existing._rev })
    }
}
export async function tryGet(db: nano.DocumentScope<any>, id: string) {
    try {
        return await db.get(id)
    } catch (err) {
        if (err.status === 404) {
            return null
        }
    }
}
