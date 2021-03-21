'use strict'
import { clientsClaim } from 'workbox-core'

const version = Config.version

const appkey = 'claptastic'

import logger from './utils/logger'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import Config from './config'
const { error, debug, log, warn } = logger('sw')

log('loading')

self.skipWaiting()
clientsClaim()
/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */

const cacheName = 'claptastic-floating'
const expiration = new ExpirationPlugin({
    maxEntries: 20,
    purgeOnQuotaError: true,
    maxAgeSeconds: 60 * 60 * 24 * 31, // roughly 1 month
})

precacheAndRoute([
    //ADD_ADDITIONAL_SW_ROUTES
    ...self.__WB_MANIFEST,
])

// local files with hash
registerRoute(
    /\/claptastic\/.+\.[0-9a-f]{32}\./,
    new CacheFirst({
        cacheName,
        plugins: [expiration],
    }),
)
