import React from "react";
import "./Spinner.scss";

const Spinner = ({ containerClassName }: { containerClassName?: string }) => (
  <div className={containerClassName}>
    <div className="spinner-container">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
);

export default Spinner;
