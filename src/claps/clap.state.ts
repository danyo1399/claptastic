import { atom } from "recoil";

const clapAtom = atom<ClapState>({
  key: "clapsState",
  default: { claps: [] },
});

export default clapAtom;

export interface ClapState {
  claps: ClapModel[];
}

export interface ClapModel {
  lat?: number;
  long?: number;
  message?: string;
  _id?: string;
  _rev?: string;
}
