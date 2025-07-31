import { HeaderBoxProps } from "#/types";
import React from "react";

const HeaderBox = ({ type = "title", title, subtext, user }: HeaderBoxProps) => {
  return (
    <div className={`header-box ${type}`}>
      <h1 className="header-box-title">
        {title}
        {/* Display user name if type is greeting */}
        {type === "greeting" && <span className="text-bankGradient"> &nbsp;{user}</span>}
      </h1>
      <p className="header-box-subtext">{subtext}</p>
    </div>
  );
};

export default HeaderBox;
