import React from "react";
import "./HomeRecordPreviewCard.scss";

interface HomeRecordPreviewCardProps {
  title: string;
  href: string;
  children: any;
}

const HomeRecordPreviewCard: React.FC<HomeRecordPreviewCardProps> = ({
  title = "",
  children,
}) => {
  return (
    <div id="home-record-preview" className="light-border card-wrapper">
      <header>
        <h4>{title}</h4>
      </header>
      <section className="preview-table">{children}</section>
    </div>
  );
};

export default HomeRecordPreviewCard;
