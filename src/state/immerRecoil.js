import { useRecoilState } from "recoil";
import produce from "immer";

export function useImmerState(atom) {
  const [state, setState] = useRecoilState(atom);

  const immerSetState = (updater) => {
    return setState((state) => {
      return produce(state, (draft) => {
        return updater(draft);
      });
    });
  };
  return [state, immerSetState];
}
