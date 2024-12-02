import { styled, DefaultTheme } from "styled-components";
import shouldForwardProp from "@styled-system/should-forward-prop";
import { space, typography, layout } from "styled-system";
import { TextProps } from "./types";

interface ThemedProps extends TextProps {
  theme: DefaultTheme;
}

const getColor = ({ color, theme }: ThemedProps) => {
  return color;
};

const getSmallFontSize = (size: string) => {
  switch (size) {
    case "14px":
    case "14":
      return "12px";

    case "18px":
    case "18":
      return "14px";

    case "20px":
    case "20":
      return "16px";

    case "22px":
    case "22":
      return "16px";

    case "30px":
    case "30":
      return "20px";

    case "43px":
    case "43":
      return "28px";

    case "48px":
    case "48":
      return "22px";

    case "60px":
    case "60":
      return "30px";

    default:
      return size;
  }
};

const Text = styled.div
  .attrs<TextProps>((props) => {
    const title =
      typeof props.title !== "undefined"
        ? props.title
        : props.ellipsis && typeof props.children === "string"
        ? props.children
        : undefined;
    return {
      ...props,
      title,
    };
  })
  .withConfig({
    shouldForwardProp,
  })<TextProps>`
  color: ${({ color }) => (color ? color : "#8D8D8D")};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: 0.2;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${({ ellipsis }) =>
    ellipsis &&
    `white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`}

  ${space}
  ${typography}
  ${layout}

  ${({ small }) => small && `font-size: 14px;`}

  @media (max-width: 1200px) {
    ${({ fontSize }) => fontSize && `font-size: ${getSmallFontSize(fontSize.toString())};`}
  }

`;

Text.defaultProps = {
  color: "#FFF",
  small: false,
  fontSize: "20px",
  ellipsis: false,
};

export default Text;
