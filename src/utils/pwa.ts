import getLogger from './logger'

const installedAppLastUsedKey = 'INSTALLED_PWA_LAST_USED'
const logger = getLogger('pwa install')
export let installedAppLastUsed = Number(
    window.localStorage.getItem(installedAppLastUsedKey) || 0,
)

if (usingInstalledApp()) {
    installedAppLastUsed = Date.now()
    logger.debug('using installed app')
    window.localStorage.setItem(
        installedAppLastUsedKey,
        installedAppLastUsed.toString(),
    )
}

export function usingInstalledApp() {
    return (
        'standalone' in window.navigator && (window.navigator as any).standalone
    )
}
