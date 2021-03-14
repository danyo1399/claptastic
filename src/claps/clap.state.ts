import { atom, selector } from "recoil";
import { useImmerRecoilState } from "../state/immerRecoil";
import {
  clapped,
  clapperAudioUpdated,
  clapperCustomAudioRemoved,
} from "./clap.events";
import { ClapState } from "./clap.models";
import { getClapperAudio } from "./clap.db";
import { tryAction } from "../utils/utils";
import getLogger from "../utils/logger";

const logger = getLogger("clap-state");

const clapAtom = atom<ClapState>({
  key: "clapAtom",
  default: { claps: [], clappers: [{ color: "yellow", audioUrl: null }] },
});

function stateActions(state: ClapState) {
  function setAduio(id: number, url: string) {
    removeAudio(id);
    const clapper = state.clappers[id];
    if (clapper) {
      clapper.audioUrl = url;
    }
  }
  function removeAudio(id: number) {
    const clapper = state.clappers[0];
    if (clapper.audioUrl) {
      tryAction(() => {
        URL.revokeObjectURL(clapper.audioUrl);
      });
    }
    clapper.audioUrl = null;
  }
  return { removeAudio, setAduio };
}

export function useClapReducer() {
  const [state, setState] = useImmerRecoilState(clapAtom);

  const clapChangeHandler = async (change) => {
    const doc = change.doc;
    await clapped.applyEvent(doc, (ev) => {
      setState((x) => {
        x.claps.push(ev.data);
      });
    });
    await clapperCustomAudioRemoved.applyEvent(doc, async (ev) => {
      setState((draft) => {
        stateActions(draft).removeAudio(ev.data.clapperId);
      });
    });

    await clapperAudioUpdated.applyEvent(doc, async (x) => {
      const data = x.data;
      const audio = await getClapperAudio(data.clapperId);
      if (!audio) {
        setState((draft) => {
          stateActions(draft).removeAudio(data.clapperId);
        });
        return;
      }
      const url = URL.createObjectURL(audio);
      setState((state) => {
        stateActions(state).setAduio(data.clapperId, url);
      });
    });
    logger.debug("after chang handler");
  };
  return clapChangeHandler;
}

export default clapAtom;

export const clappersSelector = selector({
  key: "clappersSelector",
  get: ({ get }) => {
    return get(clapAtom).clappers;
  },
});
