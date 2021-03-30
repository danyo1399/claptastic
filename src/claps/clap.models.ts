import { EventState } from '../events'

export interface ClapState extends EventState {
    claps: ClapModel[]
    clappers: ClapperModel[]
}

export interface ClapperModel {
    id: number
    audioFilename?: string
    audioType?: string
    emoji?: string
}
export interface ContainerColor {
    id: string
    color1: string
    color2: string
}
export interface ClapModel {
    lat?: number
    long?: number
    message?: string
    _id?: string
    _rev?: string
}
