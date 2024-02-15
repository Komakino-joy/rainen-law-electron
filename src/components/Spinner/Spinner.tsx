import React from 'react';
import './Spinner.scss';

const Spinner = ({
  containerClassName,
  smallSpinner,
}: {
  containerClassName?: string;
  smallSpinner?: boolean;
}) => (
  <div className={containerClassName}>
    <div className="spinner-container">
      <div className={`lds-ring ${smallSpinner && 'lds-small'}`}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  </div>
);

export default Spinner;
