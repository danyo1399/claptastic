import PouchDB from 'pouchdb-browser'
import config from '../config.json'
import React, { useEffect } from 'react'
import { useImmerRecoilSetState } from '../state/immerRecoil'
import { externalAtom } from './external.state'

export const localSyncDb = new PouchDB('serverDb', { auto_compaction: true })

export const remoteDb = new PouchDB(config.externalServers[0])

localSyncDb.replicate.from(remoteDb, {
    live: true,
    retry: true,
    checkpoint: 'target',
})

export default function ExternalDbSync() {
    const setState = useImmerRecoilSetState(externalAtom)
    useEffect(() => {
        localSyncDb
            .changes<any>({ live: true, include_docs: true })
            .on('change', (change) => {
                console.log('change', change)
                setState((x) => {
                    x.count = change.doc.count
                })
            })
    }, [])
    return <></>
}
