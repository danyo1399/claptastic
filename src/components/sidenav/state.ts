import { atom } from 'recoil'

export interface SidenavState {
    currentPage: number
}
export const sidenavState = atom<SidenavState>({
    key: 'sidenav',
    default: { currentPage: 1 },
})
