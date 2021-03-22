import { Clap, Summary } from '../models'
import { Express } from 'express'

const express = require('express')
const router = express.Router()

export function useClapRouter(clapDbPublic: any, app: Express) {
    let pendingClaps = 0
    let processing = false
    // poor mans way of handling concurrency without a queue.
    // multiple requests can come in at an time.
    // code path can only jump at an await point which is when we read and save to db.
    router.post('/', async (req, res, next) => {
        pendingClaps++
        res.sendStatus(202)
        if (processing) {
            return
        }
        try {
            processing = true
            while (pendingClaps > 0) {
                const summary: Summary = await clapDbPublic.get('summary')
                summary.count += pendingClaps
                pendingClaps = 0
                await clapDbPublic.insert(summary)
            }
        } finally {
            processing = false
        }
    })

    app.use('/claps', router)
}
