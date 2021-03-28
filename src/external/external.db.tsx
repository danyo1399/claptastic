import PouchDB from 'pouchdb-browser'
import config from '../config'
import React, { useEffect } from 'react'
import { useImmerRecoilSetState } from '../state/immerRecoil'
import { externalAtom } from './external.state'
import getLogger from '../utils/logger'
import { visibilityEventEmitter } from '../utils/browser.utils'

const logger = getLogger('external sync')
export const localSyncDb = new PouchDB('serverDb', { auto_compaction: true })

//export const remoteDb = new PouchDB(config.apiServer + '/claptastic-public')

function onError(err) {
    logger.error('sync error', err)
}

function setupSync() {
    return localSyncDb.replicate
        .from(config.apiServer + '/claptastic-public', {
            live: true,
            retry: true,
            checkpoint: 'target',
        })
        .on('error', onError)
}

let sync = setupSync()

visibilityEventEmitter.addEventListener((event) => {
    try {
        if (event === 'hidden') {
            if (!sync) return
            sync.cancel()
            sync.removeAllListeners()
            sync = null
            logger.log('Cancelling sync')
        } else {
            logger.log('Setting up sync')
            sync = setupSync()
        }
    } catch (err) {}
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
