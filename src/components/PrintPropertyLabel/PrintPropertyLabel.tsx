import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Button from "@/components/Button/Button";
import { Property } from "~/contracts";
import { PrinterIcon } from "~/icons/Icons";
import { hasValue, timestampToDate } from "~/utils";
import "./PrintPropertyLabel.scss";

const PropertyLabel = ({
  propertyInfo,
  usePrinterIcon,
}: {
  propertyInfo: Property;
  usePrinterIcon?: boolean;
}) => {
  const {
    p_type,
    p_comp_ref,
    p_unit,
    p_condo,
    p_book_1,
    p_book_2,
    p_page_1,
    p_page_2,
    p_cert_1,
    seller_1,
    seller_2,
    seller_3,
    seller_4,
    buyer_1,
    buyer_2,
    p_instructions,
    c_name,
    p_requester,
    c_file,
    p_request_date,
    p_input_date,
  } = propertyInfo;

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const getPageMargins = () => {
    return `@page { 
      margin: 20px !important; 
    }`;
  };

  const formatp_request_date = `${
    hasValue(p_request_date)
      ? timestampToDate(p_request_date, "mmDDyyyy").date
      : ""
  }`;
  const formatp_input_date = `${
    hasValue(p_input_date) ? timestampToDate(p_input_date, "mmDDyyyy").date : ""
  }`;
  const formatp_unit = p_unit ? `unit ${p_unit}` : "";

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

      <div className="label-container">
        <style>{getPageMargins()}</style>
        <div ref={componentRef}>
          <div
            style={{
              lineHeight: "22px",
              fontFamily: `'Courier New', Courier, monospace`,
              fontSize: "16px",
            }}
          >
            <p>
              {" "}
              {formatp_request_date}&nbsp;{"("}
              <b>{p_type}</b>
              {") "}
              <span style={{ fontSize: "14px" }}>
                {"(Input "}
                {formatp_input_date}
                {") "}
              </span>
              {"CR#"}
              {p_comp_ref || ""}
            </p>
            <p> {`${formatp_unit} ${p_condo || ""}`} </p>
            <p>
              {" "}
              {`B:${p_book_1 || ""} P:${p_page_1 || ""} B:${p_book_2 || ""} P:${
                p_page_2 || ""
              } C:${p_cert_1 || ""}`}{" "}
            </p>
            <p> {`S:${seller_1 || ""} S:${seller_2 || ""}`} </p>
            <p> {`S:${seller_3 || ""} S:${seller_4 || ""}`} </p>
            <p> {`B:${buyer_1 || ""} B:${buyer_2 || ""}`} </p>
            <p> {`*${p_instructions || ""}`} </p>
            <p> {`${c_name || ""}, ${p_requester || ""}`} </p>
            <p> {`${c_file || ""}`} </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyLabel;
