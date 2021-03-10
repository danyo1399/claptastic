import { atom } from "recoil";

const clapsState = atom<ClapModel[]>({
  key: "clapsState",
  default: [],
});

export default clapsState;

export interface ClapModel {
  lat?: number;
  long?: number;
  message?: string;
  _id?: string;
  _rev?: string;
}
