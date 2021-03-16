"use strict";
var fs = require("fs");
var path = require("path"),
  process = require("process");

const mountPoint = process.env.HOST_PATH || "dist";

const https = {
  cert: fs.readFileSync(path.resolve(__dirname, "../keys/localhost.pem")),
  key: fs.readFileSync(path.resolve(__dirname, "../keys/localhost-key.pem")),
};
var liveServer = require("live-server");

var params = {
  port: 8181, // Set the server port. Defaults to 8080.
  host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
  root: "./dist", // Set root directory that's being served. Defaults to cwd.
  //mount: [["/claptastic", mountPoint]],
  open: false, // When false, it won't load your browser by default.
  ignore: "scss,my/templates", // comma-separated string for paths to ignore
  file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
  wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
  logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
  middleware: [
    function (req, res, next) {
      //res.setHeader("Strict-Transport-Security", "max-age=31536000");
      // github pages always redirects to page with / on end so we must do the same.
      // without the ending slach service worker wont be able to control root page.
      if (req.url.toLowerCase().endsWith("claptastic")) {
        res.statusCode = 301;
        res.setHeader("Location", req.url + "/");
        res.end();

        return;
      }

      next();
    },
  ], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack,
  https,
};
liveServer.start(params);
