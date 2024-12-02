import styled from "styled-components";

export const IconButton = styled.button`
  background: transparent;
  border: 0px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
`;
