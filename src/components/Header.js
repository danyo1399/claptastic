import React from "react";
import InstallButton from "./InstallButton";

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
        <InstallButton></InstallButton>
      </div>
    </div>
  );
}
