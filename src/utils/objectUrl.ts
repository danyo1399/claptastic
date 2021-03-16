import getLogger from './logger'

const cache = {}
const reverseCache = {}
const logger = getLogger('objectUrl')
export function createObjectUrl(key: string, blob: Blob) {
    if (cache[key]) {
        return cache[key]
    }

    const url = URL.createObjectURL(blob)
    cache[key] = url
    reverseCache[url] = key
    return url
}

export function revokeObjectURL(url: string) {
    const key = reverseCache[url]
    if (!key) {
        logger.error('No key exists for url when revoking', url)
    }
    URL.revokeObjectURL(url)
    delete cache[key]
    delete reverseCache[url]
}
