"use strict";

import "./styles.css";

import { RecoilRoot } from "recoil";

import { log } from "./logger";
import React from "react";
import { render } from "react-dom";
import App from "./components/App";

import * as mic from "./utils/mic.utils";
import "./db.legacy";

// Experimenting with mic
// mic
//   .hasAccess()
//   .then((x) => console.log("lol mic", x))
//   .then((x) => mic.promptAndGetMediaRecorder())
//   .then(async (x) => {
//     const p = mic.getRecordedData(x);
//     x.start();
//     setTimeout(() => x.stop(), 2000);
//     const data = await p;
//     console.log("lol data", data);
//     const audio = new Audio(URL.createObjectURL(data));
//     audio.play();
//   });

const env = process.env.NODE_ENV;
console.log("Current environment", env);
if (env !== "development") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("service-worker.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById("root")
);
log("Initialising");
