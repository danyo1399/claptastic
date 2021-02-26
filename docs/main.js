"use strict";
const version = "V1.0.0";

setupAudio();
updateVersion();
showDialogIfRequired();

function updateVersion() {
  const ele = document.getElementById("version");
  ele.innerText = version;
}

function setupAudio() {
  const audio = new Audio();
  audio.src = "audio.mp3";
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
  clearInterval(interval);
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
