import { atom } from "recoil";

const installPrompt = atom({
  key: "installationState",
  default: null,
});

export default installPrompt;
