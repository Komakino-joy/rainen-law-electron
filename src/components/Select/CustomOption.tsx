import React from "react";
import { components } from "react-select";
import "./Select.scss";

const CustomOption = ({ children, ...props }: any) => {
  const { onMouseMove, onMouseOver, ...rest } = props.innerProps;
  const newProps = { ...props, innerProps: rest };
  return (
    // @ts-ignore
    <components.Option {...newProps} className="custom-option">
      {children}
    </components.Option>
  );
};

export default CustomOption;
