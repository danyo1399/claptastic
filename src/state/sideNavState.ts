import { atom } from "recoil";

const sideNavState = atom<SideNavModel>({
  key: "sideNavState",
  default: { expanded: false },
});

export default sideNavState;

export interface SideNavModel {
  expanded: boolean;
}
