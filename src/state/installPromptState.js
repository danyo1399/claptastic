import { atom } from "recoil";

const installPromptState = atom({
  key: "installationState",
  default: null,
});

export default installPromptState;
