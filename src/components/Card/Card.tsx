import React from "react";
import styled, { DefaultTheme } from "styled-components";
import { space } from "styled-system";
import { Box } from "../Layout";
import { CardProps } from "../Layout/types";

interface StyledCardProps extends CardProps {
  theme: DefaultTheme;
}
/**
 * Priority: Warning --> Success --> Active
 */
const getBorderColor = ({
  isActive,
  isSuccess,
  isWarning,
  borderBackground,
  theme,
}: StyledCardProps) => {
  if (borderBackground) {
    return borderBackground;
  }
  if (isWarning) {
    return theme.colors.warning;
  }
  if (isSuccess) {
    return theme.colors.success;
  }
  if (isActive) {
    return `${theme.colors.gradientButton}`;
  }
  return theme.colors.backgroundAlt;
};

export const StyledCard = styled.div<StyledCardProps>`
  color: ${({ theme, isDisabled }) => (isDisabled ? "grey" : "black")};
  overflow: hidden;
  position: relative;
  padding: 1px 1px 1px 1px;
  border-radius: 32px;
  border: 3px solid #1f2024;
  background: ${({ theme, background }) => background};
  box-shadow: 0px 11px 15px 0px rgba(5, 5, 5, 0.2),
    0px 24px 38px 0px rgba(5, 5, 5, 0.14), 0px 4px 4px 0px rgba(5, 5, 5, 0.25);
  ${space}
`;
export const StyledCardInner = styled(Box)<{
  background?: string;
  hasCustomBorder: boolean;
}>`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: ${({ hasCustomBorder }) =>
    hasCustomBorder ? "initial" : "inherit"};
  background: ${({ theme, background }) => background};
`;
StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false,
};

const Card: React.FC<React.PropsWithChildren<CardProps>> = ({
  ribbon,
  children,
  background,
  ...props
}) => {
  return (
    <StyledCard {...props}>
      <StyledCardInner
        background={background}
        hasCustomBorder={!!props.borderBackground}
      >
        {ribbon}
        {children}
      </StyledCardInner>
    </StyledCard>
  );
};
export default Card;
