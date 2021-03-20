export interface Doc {
    _id: string
    _rev: string
    _deleted: boolean
}

export interface Clap {
    date: number
    message: string
    userId: string
}

export interface Summary extends Doc {
    count: number
    mostRecentClaps: Clap[]
}
