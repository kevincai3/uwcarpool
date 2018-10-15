import React from "react";

const SvgLine = props => (
  <svg viewBox="0 0 29 8" width="1em" height="1em" {...props}>
    <g
      fill="currentcolor"
      stroke="currentcolor"
      fillRule="evenodd"
      strokeLinecap="square"
    >
      <path d="M1 4h27M28 4L17.2 1v6L28 4z" />
    </g>
  </svg>
);

export default SvgLine;
