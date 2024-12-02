import { useContext } from "react";
import styled, { ThemeContext } from "styled-components";

interface SpacerProps {
  size?: "sm" | "md" | "lg";
}

const Spacer: React.FC<React.PropsWithChildren<SpacerProps>> = ({
  size = "md",
}) => {
  let s: string;
  switch (size) {
    case "lg":
      s = "32px";
      break;
    case "sm":
      s = "12px";
      break;
    case "md":
    default:
      s = "24px";
  }

  return <StyledSpacer size={s} />;
};

interface StyledSpacerProps {
  size: string;
}

const StyledSpacer = styled.div<StyledSpacerProps>`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
`;

export default Spacer;
