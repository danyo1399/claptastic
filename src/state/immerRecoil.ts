import {
    RecoilState,
    SetterOrUpdater,
    useRecoilState,
    useSetRecoilState,
} from 'recoil'
import produce, { Draft } from 'immer'

export function useImmerRecoilSetState<T>(atom: RecoilState<T>) {
    const setState = useSetRecoilState(atom)

    return createImmerSetState(setState)
}

export function useImmerRecoilState<T>(atom: RecoilState<T>) {
    const [state, setState] = useRecoilState(atom)

    const immerSetState = createImmerSetState(setState)
    return [state, immerSetState] as [
        T,
        (updater: (currVal: Draft<T>) => T | void) => any,
    ]
}

function createImmerSetState<T>(setState: SetterOrUpdater<T>) {
    return (updater: (currVal: Draft<T>) => T | void) => {
        // @ts-ignore
        return setState((state) => {
            return produce(state, (draft) => {
                return updater(draft)
            })
        })
    }
}
