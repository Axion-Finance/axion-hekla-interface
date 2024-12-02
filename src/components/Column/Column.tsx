import React, { ReactNode } from "react";
import styled from "styled-components";
import { borderRadius, padding } from "styled-system";
type ColumnProps = {
  justify?: string;
  align?: string;
  children: ReactNode;
  width?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  gap?: string;
};

const ColumnContainer = styled.div<ColumnProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => props.justify || "flex-start"};
  align-items: ${(props) => props.align || "flex-start"};
  gap: ${(props) => props.gap || "20px"};
`;

export const Column: React.FC<ColumnProps> = ({
  justify,
  align,
  children,
  width,
  padding,
  border,
  borderRadius,
  gap,
}) => {
  return (
    <ColumnContainer
      justify={justify}
      align={align}
      width={width}
      padding={padding}
      border={border}
      borderRadius={borderRadius}
      gap={gap}
    >
      {children}
    </ColumnContainer>
  );
};
