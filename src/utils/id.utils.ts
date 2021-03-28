let nextId = 0

const startDate = Date.now()
export function uniqueId(prefix: string) {
    nextId++
    prefix = prefix ? `${prefix}#` : ''
    return `${prefix}${(nextId + Date.now() + startDate).toString(36)}`
}

export function uniqueNumberId() {
    nextId++
    return startDate + nextId
}
