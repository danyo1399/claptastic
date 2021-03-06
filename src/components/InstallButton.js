import React from "react";
import { useRecoilState } from "recoil";
import installPromptState from "../state/installPromptState";

import { log } from "../logger";
export default function InstallButton() {
  const [installState, setInstallState] = useRecoilState(installPromptState);
  async function click() {
    // Show the install prompt
    installState.prompt();
    // // Wait for the user to respond to the prompt
    const { outcome } = await installState.userChoice;
    // Optionally, send analytics event with outcome of user choice
    log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setInstallState(null);
  }

  return (
    installState && (
      <button
        id="install-button"
        className="update text-white mr-4 flex flex-col items-center"
        onClick={click}
      >
        <svg
          className="fill-current"
          style={{ transform: "scale(0.8)" }}
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 .5h24v24H0z" fill="none" />
          <path d="M12 16.5l4-4h-3v-9h-2v9H8l4 4zm9-13h-6v1.99h6v14.03H3V5.49h6V3.5H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2v-14c0-1.1-.9-2-2-2z" />
        </svg>
      </button>
    )
  );
}
