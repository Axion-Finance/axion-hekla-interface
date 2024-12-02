import React from "react";
import styled from "styled-components";
import UnderlineIcon from "../Icons";
import { TextProps } from "../Text";
interface TextWithLinkProps {
  text: string;
  link: string;
  iconColor: string;
}
const TextLink = styled.a`
  text-decoration: none;
  color: #000;
  font-weight: bold;
`;

const TextWithLink: React.FC<TextWithLinkProps> = ({
  text,
  link,
  iconColor,
}) => {
  return (
    <div>
      <TextLink href={link} target="_blank">
        {text}
      </TextLink>
      <UnderlineIcon width="200px" color={iconColor} />
    </div>
  );
};

export default TextWithLink;
