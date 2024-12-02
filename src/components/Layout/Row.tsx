import styled from "styled-components";
import Box from "./Box";

const Row = styled(Box)<{
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
  flex-direction: row;
  align-items: ${({ align }) => align ?? "center"};
  justify-content: ${({ justify }) => justify ?? "space-between"};
  padding: ${({ padding }) => padding ?? "0"};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
  gap: ${({ gap }) => gap ?? "2px"};
`;

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-direction: row;
  gap: ${({ gap }) => gap};
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

export const RowWrap = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export default Row;
