import ClapSvg from "./ClapSvg";
import React from "react";

export function ClapsCounter(props: { count: number }) {
  return (
    <div className="flex items-center pr-1">
      <span className="px-2">{props.count}</span>
      <div className="counter-icon">
        <ClapSvg width="1.25rem"></ClapSvg>
      </div>
    </div>
  );
}
