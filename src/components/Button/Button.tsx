import React from "react";
import "./Button.scss";

interface OwnProps {
  children: React.ReactElement | string;
  isDisabled: boolean;
  onClick?: (e: React.SyntheticEvent) => void;
  type: "button" | "submit" | "reset" | undefined;
  customClass?: string;
  inlineStyles?: {};
  redVariant?: boolean;
}

const Button: React.FC<OwnProps> = ({
  children,
  isDisabled,
  onClick,
  type,
  customClass,
  inlineStyles,
  redVariant,
}) => (
  <button
    className={`
      ${customClass}
      ${"base-styles"} 
      ${redVariant ? "red-variant" : ""}
      ${isDisabled ? "disabled" : ""} 
    `}
    onClick={isDisabled ? () => {} : onClick}
    type={type}
    style={{ ...inlineStyles }}
  >
    {children}
  </button>
);

export default Button;
