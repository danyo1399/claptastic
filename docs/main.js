"use strict";
const version = "1.0.14";

let deferredPrompt;
const audio = new Audio();

window.addEventListener("beforeinstallprompt", (e) => {
  console.log("before install prompt");
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  //e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI to notify the user they can add to home screen
});

(async () => {
  await setupAudio();
  updateVersion();
  showDialogIfRequired();
  setupVisibilityChange();
})();

function updateVersion() {
  const ele = document.getElementById("version");
  ele.innerText = `V${version}`;
}

async function loadMp3() {
  // Noticed some odd behavior in android where if offline for certain amount of time looks like audio is
  // removed from cache?
  // store in indexdb just to be safe
  // If we have previous saved version in db, we may still live
  try {
    const mp3 = await fetch("audio.mp3");
    const blob = await mp3.blob();
    await localforage.setItem("mp3", blob);
  } catch (e) {
    console.error("Failed to load audio", e);
  }
}

function setupVisibilityChange() {
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    function handleVisibilityChange() {
        if (document[hidden]) {
            stopAnim();
            audio.load();
        }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

}
async function setupAudio() {
  await loadMp3();

  const blob = await localforage.getItem("mp3");
  const url = URL.createObjectURL(blob);

  audio.src = url;
  audio.addEventListener("ended", (event) => {
    stopAnim();
  });
  audio.addEventListener("play", (event) => {
    startAnim();
  });
  window.play = () => audio.play();
}
function showDialogIfRequired() {
  const dialogShown = localStorage.getItem("dialog_shown");
  if (!dialogShown) {
    showDialog();
  }
}

let interval;
function startAnim() {
    if(interval != null) {
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
    if(interval == null) {
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
  localStorage.setItem("dialog_shown", "Y");
}
function showDialog() {
  const ele = document.getElementById("dialog");
  ele.style.display = "";
}
