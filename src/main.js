"use strict";

import "./styles.css";

import { RecoilRoot } from "recoil";

import { log } from "./logger";
import React from "react";
import { render } from "react-dom";
import App from "./components/App";

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

import "./db";

render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById("root")
);
log("Initialising");
