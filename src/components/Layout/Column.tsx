import styled from "styled-components";
import Box from "./Box";

const Column = styled(Box)<{
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
  gap?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align ?? "center"};
  justify-content: ${({ justify }) => justify ?? "flex-start"};
  padding: ${({ padding }) => padding ?? "0"};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  gap: ${({ gap }) => gap ?? "2px"};
`;

export const AutoColumn = styled(Column)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export default Column;
