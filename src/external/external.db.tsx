import PouchDB from 'pouchdb-browser'
import config from '../config'
import React, { useEffect } from 'react'
import { useImmerRecoilSetState } from '../state/immerRecoil'
import { externalAtom } from './external.state'
import getLogger from '../utils/logger'

const logger = getLogger('external sync')
export const localSyncDb = new PouchDB('serverDb', { auto_compaction: true })

export const remoteDb = new PouchDB(config.apiServer + '/claptastic-public')

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
                logger.debug('change', change)
                setState((x) => {
                    x.count = change.doc.count
                })
            })
            .on('error', (error) => {
                logger.error('error syncing', error)
            })
    }, [])
    return <></>
}
