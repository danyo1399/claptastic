import { RecoilState, useRecoilState } from "recoil";
import produce, { Draft } from "immer";

export function useImmerRecoilState<T>(atom: RecoilState<T>) {
  const [state, setState] = useRecoilState(atom);

  const immerSetState = (updater: (currVal: Draft<T>) => T | void) => {
    // @ts-ignore
    return setState((state) => {
      return produce(state, (draft) => {
        return updater(draft);
      });
    });
  };
  return [state, immerSetState] as [
    T,
    (updater: (currVal: Draft<T>) => T | void) => any
  ];
}
