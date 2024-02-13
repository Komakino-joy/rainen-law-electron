import React from "react";
import "./InfoCard.scss";

interface OwnProps {
  line1: string;
  line2?: string;
  customStyles?: {};
}

const InfoCard: React.FC<OwnProps> = ({ line1, line2, customStyles }) => (
  <div className="info-card" style={{ ...customStyles }}>
    <span>{line1}</span>
    <span>{line2}</span>
  </div>
);

export default InfoCard;
