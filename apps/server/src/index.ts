import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'

import cors from 'cors'
import { setupDb } from './db'
import { Clap, Summary } from './models'
import { createProxyMiddleware } from 'http-proxy-middleware'
const app = express()
import compression from 'compression'
import morgan from 'morgan'
import { useClapRouter } from './routes/clap.router'
const port = process.env.PORT || 3000
app.use(cors({ origin: true, credentials: true }))
const { COUCHDB_USER, COUCHDB_PASSWORD, COUCHDB_SERVER } = process.env

setupDb().then(({ clapDbPublic, clapDb }) => {
    app.use(morgan('combined'))
    app.use(compression())

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

        console.log('rejected req', { method: req.method, url })
        res.status(401)
        res.end()
        return
    })
    app.use(
        '/claptastic-public',
        createProxyMiddleware({
            target: `http://${COUCHDB_SERVER}`,
            changeOrigin: true,
            auth: `${COUCHDB_USER}:${COUCHDB_PASSWORD}`,
        }),
    )

    // stick this after other streaming routes
    app.use(bodyParser.json())

    useClapRouter(clapDbPublic, app)

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
})
