import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'

import cors from 'cors'
import { setupDb } from './db'
import { Clap, Summary } from './models'
import { createProxyMiddleware } from 'http-proxy-middleware'
const app = express()

const port = process.env.PORT || 3000
app.use(cors({ origin: true, credentials: true }))
const { COUCHDB_USER, COUCHDB_PASSWORD } = process.env
console.log('server settings', process.env)
setupDb().then(({ clapDbPublic, clapDb }) => {
    app.use('/claptastic-public', (req, res, next) => {
        const { url, method } = req

        const allowedPostPrefixes = ['/_all_docs', '/_bulk_get?']
        const allowedGetPrefixes = [, '/_changes?', '/_all_docs', '/']
        if (
            allowedGetPrefixes.some(
                (prefix) => url.startsWith(prefix) && req.method === 'GET',
            )
        ) {
            return next()
        }

        if (
            allowedPostPrefixes.some(
                (prefix) => url.startsWith(prefix) && req.method === 'POST',
            )
        ) {
            return next()
        }

        console.log('rejected req', { req, url })
        res.status(401)
        res.end()
        return
    })
    app.use(
        '/claptastic-public',
        createProxyMiddleware({
            target: `http://claptastic-couchdb:5984`,
            changeOrigin: true,
            auth: `${COUCHDB_USER}:${COUCHDB_PASSWORD}`,
        }),
    )

    // stick this after other streaming routes
    app.use(bodyParser.json())

    app.post('/claps', async (req, res, next) => {
        const maxclaps = 2
        const summary: Summary = await clapDbPublic.get('summary')
        const doc: Clap = req.body

        doc.message = (doc.message || '').slice(0, 50)
        doc.userId = (doc.userId || '').slice(0, 20)

        summary.mostRecentClaps.push({
            message: doc.message,
            date: Date.now(),
            userId: doc.userId,
        })
        summary.count++
        const len = summary.mostRecentClaps.length
        if (len > maxclaps) {
            summary.mostRecentClaps = summary.mostRecentClaps.slice(
                len - maxclaps,
            )
        }
        await clapDbPublic.insert(summary)
        res.json(req.body)
    })

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})
