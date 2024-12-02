import styled from "styled-components";
import { BoxProps } from "../Layout";

interface ImageProps extends BoxProps {
  src: string;
  alt: string;
  width?: string;
  height?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt, width, height }) => {
  return <img src={src} alt={alt} width={width} height={height} />;
};

export default Image;
