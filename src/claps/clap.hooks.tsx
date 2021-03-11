import clapAtom from "./clap.state";
import { useEffect } from "react";
import { useImmerRecoilState } from "../state/immerRecoil";
import { clapped } from "./clap.events";

export function useClap() {
  const [state, setState] = useImmerRecoilState(clapAtom);

  const clapChangeHandler = (change) => {
    const doc = change.doc;
    if (clapped.isType(doc)) {
      setState((x) => {
        x.claps.push(doc);
      });
    }
  };
  return { clapChangeHandler };
}
