import React from "react";

const HeaderBox = ({
  type = "title",
  title,
  subtext,
  user,
}: HeaderBoxProps) => {
  return (
    <div className={`header-box ${type}`}>
      <h2 className="header-title">{title}</h2>
      {subtext && <p className="header-subtext">{subtext}</p>}
      {user && <p>Logged in as: {user}</p>}
    </div>
  );
};

export default HeaderBox;
