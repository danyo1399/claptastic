"use strict";
let deferredPrompt;
const audio = new Audio();
const version = '1.0.27'

if ("serviceWorker" in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js");
    });
}

window.addEventListener("beforeinstallprompt", (e) => {
  console.log("before install prompt");
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.

  deferredPrompt = e;
    installButton.style.display = 'flex';
  // Update UI to notify the user they can add to home screen
});

// IOS pwa updates are janky. instead give button to force update.
// Dont autoupdate as could end up in endless loop
const updateButton = document.getElementById('update-button');
updateButton.onclick = async () => {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister()
        }
    })

    await caches.delete('claptastic-store')
    window.location.reload(true)
}

const installButton = document.getElementById('install-button');
installButton.onclick = async () => {
    // Hide the app provided install promotion
    installButton.style.display = 'none';
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
}

(async () => {
  await setupAudio();
  updateVersion();
  showDialogIfRequired();
  await setupVisibilityChange();
  await versionCheck();
})();

function compareVersions(v1, v2){
    const v1Parts = v1.split('.');
    const v2Parts = v2.split('.');
    for(let i = 0;i<3;i++) {
        const result = + v1Parts[i] - v2Parts[i];
        if(result !== 0) {
            return result;
        }
    }
    return 0;
}
async function versionCheck() {
    try {
        const resp = await fetch('version.json?rnd=' + Date.now());
        const json = await resp.json()
        const latestVersion = json.version;
        console.log('version check', {latestVersion, currentVersion: version});
        const compareResult = compareVersions(version, latestVersion);

        if (compareResult < 0 ) {
            updateButton.style.display = 'flex';
        }
    }
    catch(e) {
        console.warn('Failed version check', e)
    }
}

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

async function setupVisibilityChange() {
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
    async function handleVisibilityChange() {
        if (document[hidden]) {
            stopAnim();
            audio.load();
        } else {
            await versionCheck();
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
