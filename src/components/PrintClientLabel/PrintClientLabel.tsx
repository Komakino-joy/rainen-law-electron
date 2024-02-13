import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "@/components/Button/Button";
import { Client } from "~/contracts";
import { PrinterIcon } from "~/icons/Icons";

import "./PrintClientLabel.scss";

const PrintClientLabel = ({
  clientInfo,
  usePrinterIcon,
}: {
  clientInfo: Client;
  usePrinterIcon?: boolean;
}) => {
  const { c_name, c_address_1, c_address_2, c_city, c_state, c_zip } =
    clientInfo;

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getPageMargins = () => {
    return `@page { 
      margin: 20px !important; 
    }`;
  };

  return (
    <>
      {usePrinterIcon ? (
        <span onClick={handlePrint}>
          <PrinterIcon />
        </span>
      ) : (
        <Button type="button" isDisabled={false} onClick={handlePrint}>
          Print Label
        </Button>
      )}

      <div className="client-label-container">
        <style>{getPageMargins()}</style>
        <div ref={componentRef}>
          <div
            style={{
              lineHeight: "22px",
              fontFamily: `'Courier New', Courier, monospace`,
              fontSize: "16px",
            }}
          >
            <p> {c_name}</p>
            <p> {c_address_1} </p>
            <p> {c_address_2} </p>
            <p> {`${c_city || ""} ${c_state || ""} ${c_zip || ""}`} </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintClientLabel;
