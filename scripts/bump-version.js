"use strict";
const fs = require("fs"),
  path = require("path");

const jsonPath = path.resolve(__dirname, "../", "version.json");
const savedVersion = require(jsonPath);
const versionStr = savedVersion.version;
const versionParts = versionStr.split(".").map((x) => Number(x));
versionParts[2] = (versionParts[2] || 0) + 1;

savedVersion.version = versionParts.join(".");

console.log("version to save", savedVersion);

fs.writeFileSync(jsonPath, JSON.stringify(savedVersion));
