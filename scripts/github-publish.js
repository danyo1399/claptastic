const ghpages = require("gh-pages");

ghpages.publish("dist", function (err) {
  console.error("Failed to publish", err);
  process.exitCode = -1;
});
