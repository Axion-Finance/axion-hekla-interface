import React, { ElementType, ReactNode } from "react";
import styled, { PolymorphicComponentProps } from "styled-components";
import { LayoutProps, SpaceProps, variant } from "styled-system";
import { Row } from "../Layout";
import { Text, TextProps } from "../Text";

export const scales = {
  MD: "md",
  SM: "sm",
  XS: "xs",
} as const;

export const scaleVariants = {
  [scales.MD]: {
    height: "68px",
    padding: "0 24px",
  },
  [scales.SM]: {
    height: "40px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "32px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

const StyledButton = styled.button<{
  isPrimary: boolean;
  width: string;
  isFilled?: boolean;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 300px;
  border: 1px solid ${({ isFilled }) => (isFilled ? "transparent" : "#fff")};
  height: 38px;
  padding: 0px 24px;
  background-color: #000000;
  width: ${({ width }) => (width ? width : "auto")};
  // box-shadow: 0px -1px 0px 0px rgba(14, 14, 44, 0.4) inset;
  cursor: pointer;
  display: inline-flex;
  text-align: center;
  font-family: Sequel100Black-45;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 84px; /* 840% */
  justify-content: center;
  letter-spacing: 0.03em;
  line-height: 1;
  outline: 0;
  transition: background-color 0.2s, opacity 0.2s;
  color: #fff;

  :focus-visible {
    outline: none;
    box-shadow: "";
  }

  @media (hover: hover) {
    &:hover:not(:disabled):not(:active) {
      transform: translateY(-0.08em);
    }
  }

  &:active:not(:disabled) {
    opacity: 0.85;
    transform: translateY(1px);
    box-shadow: none;
  }
  ${variant({
    prop: "scale",
    variants: scaleVariants,
  })}
  &:disabled {
    background-color: "";
    cursor: not-allowed;
    color: "#ffca3c";
  }
`;

const ButtonWrapper = styled.div<{ width: string }>`
  display: flex;
  padding-bottom: 4px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  background: var(--Charcoal, #1f2024);
  width: ${({ width }) => (width ? width : "auto")};
`;

export interface BaseButtonProps extends LayoutProps, SpaceProps {
  as?: "a" | "button" | ElementType;
  children: string;
  external?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  textProps?: TextProps;
  isPrimary?: boolean;
  isFilled?: boolean;
  decorator?: {
    backgroundColor?: string;
    color?: string;
    text: string;
    direction?: "left" | "right";
  };
}
export type ButtonProps<P extends ElementType = "button"> = PolymorphicComponentProps<any, BaseButtonProps, P, any>;

const Button = <E extends ElementType = "button">(props: ButtonProps): JSX.Element => {
  const { startIcon, endIcon, external, isLoading, disabled, children, textProps, width, ...rest } = props;
  return (
    <StyledButton {...rest} disabled={disabled} isLoading={isLoading} external={external} width={width || "auto"}>
      {startIcon}
      {children}
      {endIcon}
    </StyledButton>
  );
};

export default Button;
