import { EventState } from '../events'

export interface ClapState extends EventState {
    claps: ClapModel[]
    clappers: ClapperModel[]
}

export interface ClapperModel {
    color: string
    audioFilename?: string
    audioType?: string
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
