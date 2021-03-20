import { atom } from 'recoil'

export interface ExternalModel {
    count: number
}
export function externalDefault() {
    return { count: 0 }
}

export const externalAtom = atom<ExternalModel>({
    key: 'ExternalAtom',
    default: externalDefault(),
})
