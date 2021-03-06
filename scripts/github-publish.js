const ghpages = require("gh-pages");

const process = require("process");
const path = require("path");
const distPath = path.resolve(__dirname, "../dist/claptastic");

console.log("dist path", distPath);
ghpages.publish(distPath, function (err) {
  if (err) {
    console.error("Failed to publish", err);
    process.exitCode = -1;
  } else {
    console.log("publish success");
  }
});
