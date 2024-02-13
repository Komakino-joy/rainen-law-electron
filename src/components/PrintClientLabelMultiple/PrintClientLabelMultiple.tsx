import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "@/components/Button/Button";
import { Client } from "~/contracts";
import { PrinterIcon } from "~/icons/Icons";

import "./PrintClientLabelMultiple.scss";

const PrintClientLabelMultiple = ({
  clients,
  usePrinterIcon,
  children,
}: {
  clients: Client[];
  usePrinterIcon?: boolean;
  children: any;
}) => {
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
          {children}
        </Button>
      )}

      <div id="client-label-container">
        <style>{getPageMargins()}</style>
        <div ref={componentRef}>
          {clients.map((client) => {
            const { c_name, c_address_1, c_address_2, c_city, c_state, c_zip } =
              client;

            return (
              <div
                key={c_name}
                style={{
                  fontSize: "16px",
                  height: "100px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  fontFamily: `'Times New Roman','Courier New', Courier, monospace`,
                }}
              >
                <p> {c_name}</p>
                <p> {c_address_1} </p>
                <p> {c_address_2} </p>
                <p> {`${c_city || ""} ${c_state || ""} ${c_zip || ""}`} </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PrintClientLabelMultiple;
