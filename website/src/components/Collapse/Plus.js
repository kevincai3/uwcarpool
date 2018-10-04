import React from "react";

const SvgCross = props => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" {...props}>
    <g stroke="currentcolor" fill="none" fillRule="evenodd" strokeLinecap="square">
      <path d="M12 1v22M1 12h22" />
    </g>
  </svg>
);

export default SvgCross;
