import React, { useState } from "react";
import "./Tooltip.scss";

type OwnProps = {
  text: string;
  icon: React.ReactNode;
};

const Tooltip: React.FC<OwnProps> = ({ text, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="tooltip tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="icon">{icon}</div>
      {isHovered && <div className="tooltip-text">{text}</div>}
    </div>
  );
};

export default Tooltip;
