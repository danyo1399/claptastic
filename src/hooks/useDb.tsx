import { useEffect } from "react";
import { addClap as dbAddClap, getAllClaps } from "../db";
import clapsState from "../state/clapsState";
import { useImmerRecoilState } from "../state/immerRecoil";

// TODO: This is prolly a react context rather than a hook
export default function useDb() {
  const [state, setState] = useImmerRecoilState(clapsState);

  async function addClap() {
    const clap = await dbAddClap({});
    setState((x) => {
      x.push(clap);
    });
  }
  return { addClap, state };
}

export function DbProvider() {
  const [state, setState] = useImmerRecoilState(clapsState);
  useEffect(() => {
    async function load() {
      const claps = await getAllClaps();
      console.log("lol claps", claps);
      setState(() => claps);
    }
    load();
  }, []);
  return null;
}
