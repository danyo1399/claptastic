import PouchDB from 'pouchdb-browser'

async function tryGet(id: string, db: PouchDB.Database) {
    try {
        return await db.get(id)
    } catch (err) {
        if (err.status === 404) {
            return null
        }
        throw err
    }
}

export async function upsert(doc, db: PouchDB.Database) {
    const existing = await tryGet(doc._id, db)
    if (existing) {
        return await db.put({
            ...doc,
            _id: existing._id,
            _rev: existing._rev,
        })
    } else {
        return db.put(doc)
    }
}

export function blobStorage(db: PouchDB.Database) {
    function genId(key: string) {
        return `${key}#blob`
    }

    async function deleteItem(key: string) {
        if (key == null || key == '') {
            return
        }
        const id = await genId(key)
        const doc = await tryGet(id, db)
        if (doc) {
            return db.remove(doc)
        }
    }

    async function getItem(key: string) {
        const id = genId(key)
        try {
            return await db.getAttachment(id, id)
        } catch (err) {
            if (err.status === 404) {
                return null
            }
        }
    }

    async function setItem(key: string, blob: Blob) {
        const docId = genId(key)
        await upsert(
            {
                _id: docId,
                _attachments: {
                    [docId]: {
                        content_type: blob.type,
                        data: blob,
                    },
                },
            },
            db,
        )
    }

    return { getItem, setItem, deleteItem }
}
