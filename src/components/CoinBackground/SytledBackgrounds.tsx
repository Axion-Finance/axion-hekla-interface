import styled from "styled-components";
import coin1 from "../../public/images/tokenomics/coin1.png";
const CoinBg = styled.div<{
  isVisible?: boolean;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zValue?: number;
  backgroundImage?: string;
  rotation?: string;
  imageWidth?: string;
  imageHeight?: string;
  width?: string;
  height?: string;
}>`
  position: absolute;
  z-index: ${({ zValue }) => zValue ?? 0};

  width: ${({ width }) => width ?? "140px"};
  height: ${({ height }) => height ?? "140px"};

  top: ${({ top }) => top ?? undefined};
  bottom: ${({ bottom }) => bottom ?? undefined};
  left: ${({ left }) => left ?? undefined};
  right: ${({ right }) => right ?? undefined};

  background-image: ${({ backgroundImage }) =>
    backgroundImage ? `url(${backgroundImage})` : { coin1 }};
  background-size: cover;
  transform: ${({ rotation }) =>
    rotation ? `rotate(${rotation}deg)` : "none"};
`;

export default CoinBg;
