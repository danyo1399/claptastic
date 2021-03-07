import { atom } from "recoil";

const sideNavState = atom({
  key: "sideNavState",
  default: { expanded: false },
});

export default sideNavState;
