import React from "react";

import Select, { createFilter } from "react-select";
import CustomOption from "./CustomOption";
import CustomMenuList from "./CustomMenuList";
import "./Select.scss";

const customStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    background: "#fff",
    border: "none",
    minHeight: "30px",
    height: "30px",
    boxShadow: state.isFocused ? null : null,
    minWidth: "80px",
  }),

  valueContainer: (provided: any, state: any) => ({
    ...provided,
    height: "30px",
    padding: "0 6px",
  }),

  input: (provided: any, state: any) => ({
    ...provided,
    margin: "0px",
  }),

  indicatorSeparator: (state: any) => ({
    display: "none",
  }),

  indicatorsContainer: (provided: any, state: any) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  }),

  clearIndicator: (provided: any, state: any) => ({
    ...provided,
    padding: "0 0 0 8px",
    cursor: "pointer",
    "&:hover": {
      color: "#9c3237",
    },
  }),

  dropdownIndicator: (provided: any, state: any) => ({
    display: "none",
  }),

  option: (provided: any, state: any) => ({
    ...provided,
    height: "35px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    padding: "10px 20px 10px 5px",
  }),
};

interface OwnProps {
  onChange: () => void;
  options: any[];
  defaultValue: any;
  isError: boolean;
}

const CustomSelect = ({
  onChange,
  options,
  defaultValue,
  isError = false,
}: OwnProps) => {
  return (
    <>
      <Select
        defaultInputValue={defaultValue}
        className={`"select-container" ${isError && "border-red"}`}
        // classNamePrefix="select"
        // @ts-ignore
        styles={customStyles}
        isClearable={true}
        isSearchable={true}
        options={[{ label: "", value: "" }, ...options]}
        filterOption={createFilter({ ignoreAccents: false })}
        // @ts-ignore
        components={{ Option: CustomOption, MenuList: CustomMenuList }}
        // @ts-ignore
        onChange={(input) => {
          // @ts-ignore
          if (input?.value) {
            // @ts-ignore
            onChange(input.value);
          }
          return;
        }}
      />
    </>
  );
};

export default CustomSelect;
