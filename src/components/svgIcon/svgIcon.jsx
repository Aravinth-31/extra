import React from "react";
import { svgPath } from "../../constants";

const svgIcon = ({ name }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {(svgPath[name] || []).map((d) => {
        return <path d={d} key={JSON.stringify(d)} fill="#23282E" />;
      })}
    </svg>
  );
};

export default svgIcon;
