import { isProd } from './environment'
import { addBreadcrumb, Severity } from '@sentry/react'

export type NameFn = () => string

// Info and above log to sentry breadcrumbs in prod
// warn and above log to console in prod
// In dev all sentry logging disabled, and all all console logging enabled
export default function getLogger(name: string | NameFn) {
    const version = process.env.version
    function getName() {
        if (typeof name === 'function') return name()
        return name
    }
    function log(msg, ...args) {
        if (isProd()) {
            addBreadcrumb({
                category: getName(),
                level: Severity.Info,
                message: msg,
                data: { args },
            })
        } else {
            console.log(`[${getName()} ${version}] ${msg}`, ...args)
        }
    }

    function error(msg, ...args) {
        if (isProd()) {
            addBreadcrumb({
                category: getName(),
                level: Severity.Error,
                message: msg,
                data: { args },
            })
        }
        console.error(`[${getName()} ${version}] ${msg}`, ...args)
    }

    function warn(msg, ...args) {
        if (isProd()) {
            addBreadcrumb({
                category: getName(),
                level: Severity.Warning,
                message: msg,
                data: { args },
            })
        }
        console.warn(`[${getName()} ${version}] ${msg}`, ...args)
    }

    function debug(msg, ...args) {
        if (!isProd()) {
            console.debug(`[${getName()} ${version}] ${msg}`, ...args)
        }
    }

    return { log, error, warn, debug }
}

export const { log, error, warn, debug } = getLogger('app')
