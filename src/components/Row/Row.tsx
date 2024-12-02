import React, { ReactNode } from "react";
import styled from "styled-components";

type RowProps = {
  justify?: string;
  align?: string;
  children: ReactNode;
};

const RowContainer = styled.div<RowProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.justify || "flex-start"};
  align-items: ${(props) => props.align || "flex-start"};
`;

export const Row: React.FC<RowProps> = ({ justify, align, children }) => {
  return (
    <RowContainer justify={justify} align={align}>
      {children}
    </RowContainer>
  );
};
