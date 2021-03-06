import React from "react";
import InstallPrompt from "./InstallPrompt";

export default function Header() {
  const version = WEBPACK_VERSION;
  return (
    <div className="header">
      <div className="flex">
        <span>Claptastic</span>
        <span id="version" className="version">
          V{version}
        </span>
      </div>
      <div className="flex">
        <InstallPrompt></InstallPrompt>
      </div>
    </div>
  );
}
