import { useEffect } from "react";
import { getAllClaps } from "../db";
import { useRecoilState } from "recoil";
import clapsState from "../state/clapsState";
import { useImmerRecoilState } from "../state/immerRecoil";

// TODO: This is prolly a react context rather than a hook
export default function useDb() {
  const [state, setState] = useImmerRecoilState(clapsState);
  useEffect(async () => {
    async function load() {
      const claps = await getAllClaps();
      setState(() => claps);
    }
    load();
  }, []);
}
