'use strict'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import React from 'react'
import { RecoilRoot } from 'recoil'
import { render } from 'react-dom'
import { CaptureConsole } from '@sentry/integrations'

const logger = getLogger('main')
if (process.env.sentry) {
    logger.log('Initialising Sentry')
    Sentry.init({
        dsn: 'https://698a6ff842d340e6b7b78f0eb4873ce5@o551318.ingest.sentry.io/5674666',
        integrations: [new Integrations.BrowserTracing(), new CaptureConsole({ levels: ['error', 'warn'] })],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    })
}
import './styles.css'

import getLogger, { log } from './utils/logger'
import App from './components/App'

import * as mic from './utils/mic.utils'
import './db.legacy'
import { isProd } from './utils/environment'

// Experimenting with mic
// mic
//   .hasAccess()
//   .then((x) => console.log("lol mic", x))
//   .then((x) => mic.promptAndGetMediaRecorder())
//   .then(async (x) => {
//     const p = mic.getRecordedData(x);
//     x.start();
//     setTimeout(() => x.stop(), 2000);
//     const data = await p;
//     console.log("lol data", data);
//     const audio = new Audio(URL.createObjectURL(data));
//     audio.play();
//   });

const env = process.env.NODE_ENV
logger.log('Current environment', env)
if (env !== 'development') {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('service-worker.js')
                .then((registration) => {
                    logger.log('SW registered: ', registration)
                })
                .catch((registrationError) => {
                    logger.error('SW registration failed: ', registrationError)
                })
        })
    }
}

render(
    <RecoilRoot>
        <App />
    </RecoilRoot>,
    document.getElementById('root'),
)
log('Initialising')
