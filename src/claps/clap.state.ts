import { atom, selector } from 'recoil';
import { useImmerRecoilState } from '../state/immerRecoil';
import { clapped, clapperAudioUpdated, clapperCustomAudioRemoved } from './clap.events';
import { ClapState } from './clap.models';
import { tryAction } from '../utils/utils';
import getLogger from '../utils/logger';

const logger = getLogger('clap-state');

const clapAtom = atom<ClapState>({
  key: 'clapAtom',
  default: {
    claps: [],
    clappers: [{ color: 'yellow', userAudioBlobKey: null }],
  },
});

function stateActions(state: ClapState) {
  function setAudio(id: number, key) {
    const clapper = state.clappers[id];
    if (clapper) {
      clapper.userAudioBlobKey = key;
    }
  }

  function removeAudio(id: number) {
    const clapper = state.clappers[id];
    clapper.userAudioBlobKey = null;
  }
  return { removeAudio, setAudio: setAudio };
}

export function useClapReducer() {
  const [state, setState] = useImmerRecoilState(clapAtom);

  const clapChangeHandler = (change) => {
    const doc = change.doc;
    clapped.applyEvent(doc, (ev) => {
      setState((x) => {
        x.claps.push(ev.data);
      });
    });

    clapperCustomAudioRemoved.applyEvent(doc, (ev) => {
      setState((draft) => {
        stateActions(draft).removeAudio(ev.data.clapperId);
      });
    });

    clapperAudioUpdated.applyEvent(doc, (x) => {
      const data = x.data;
      setState((state) => {
        stateActions(state).setAudio(data.clapperId, data.key);
      });
    });
    logger.debug('after chang handler');
  };
  return clapChangeHandler;
}

export default clapAtom;

export const clappersSelector = selector({
  key: 'clappersSelector',
  get: ({ get }) => {
    return get(clapAtom).clappers;
  },
});
