"use strict";
import "./tailwind.css";
import "./styles.css";
import audioFileUrl from "./media/audio.mp3";

import * as localForage from "localforage";
const clapAudioStorageKeyItem = "mp3";

import createLogger from "./logger";
const { error, debug, log, warn } = createLogger("app");

log("Initialising");
let deferredPrompt;

const audio = new Audio();

const dialogShownKey = "dialog_shown";

const installButton = document.getElementById("install-button");

window.addEventListener("beforeinstallprompt", (e) => {
  log("before install prompt");
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.

  deferredPrompt = e;
  installButton.style.display = "flex";
  // Update UI to notify the user they can add to home screen
});

installButton.onclick = async () => {
  // Hide the app provided install promotion
  installButton.style.display = "none";
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
};

(async () => {
  await setupAudio();
  showDialogIfRequired();
  await setupVisibilityChange();
})();

// function compareVersions(v1, v2){
//     const v1Parts = v1.split('.');
//     const v2Parts = v2.split('.');
//     for(let i = 0;i<3;i++) {
//         const result = + v1Parts[i] - v2Parts[i];
//         if(result !== 0) {
//             return result;
//         }
//     }
//     return 0;
// }

async function loadMp3() {
  // Noticed some odd behavior in android where if offline for certain amount of time looks like audio is
  // removed from cache?
  // store in indexdb just to be safe
  // If we have previous saved version in db, we may still live
  try {
    const response = await fetch(audioFileUrl);
    if (!response.ok) {
      throw response;
    }

    const blob = await response.blob();
    await localForage.setItem(clapAudioStorageKeyItem, blob);
  } catch (e) {
    error("Failed to load audio", e);
  }
  return clapAudioStorageKeyItem;
}

async function setupVisibilityChange() {
  var hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") {
    // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }
  async function handleVisibilityChange() {
    if (document[hidden]) {
      stopAnim();
      audio.load();
    }
  }

  document.addEventListener(visibilityChange, handleVisibilityChange, false);
}
async function setupAudio() {
  const storageItemKey = await loadMp3();

  const blob = await localForage.getItem(storageItemKey);
  audio.src = URL.createObjectURL(blob);
  audio.addEventListener("ended", (_) => {
    stopAnim();
  });
  audio.addEventListener("play", (_) => {
    startAnim();
  });
}

function play() {
  audio.play();
}

function showDialogIfRequired() {
  const dialogShown = localStorage.getItem(dialogShownKey);
  if (!dialogShown) {
    showDialog();
  }
}

let interval;
function startAnim() {
  if (interval != null) {
    return;
  }
  const ele = document.getElementById("icon");
  let toggle = false;
  interval = setInterval(() => {
    if (!toggle) {
      ele.style.transform = "scale(1.2)";
      toggle = true;
    } else {
      ele.style.transform = "scale(1)";
      toggle = false;
    }
  }, 100);
}
function stopAnim() {
  if (interval == null) {
    return;
  }
  clearInterval(interval);
  interval = null;
  const ele = document.getElementById("icon");
  ele.style.transform = undefined;
}

function closeDialog() {
  const ele = document.getElementById("dialog");
  ele.style.display = "none";
  localStorage.setItem(dialogShownKey, "Y");
}

function showDialog() {
  const ele = document.getElementById("dialog");
  ele.style.display = "";
}

window.app = { closeDialog, showDialog, play };
