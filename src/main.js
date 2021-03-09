"use strict";

import "./styles.css";

import { RecoilRoot } from "recoil";

import { log } from "./logger";
import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./db";
render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
  document.getElementById("root")
);
log("Initialising");
