import React from "react";
import styled, { keyframes } from "styled-components";
import { Row } from "../Layout";
import { Text } from "../Text";

type marqueeOptions = {
  elmSpeed?: number;
  forwardTitle?: string | undefined;
  data: any[];
};

const Marquee = ({ elmSpeed, forwardTitle, data }: marqueeOptions) => {
  return (
    <MarqueeCtr>
      {forwardTitle && (
        <Row width="fit-content" gap="4px" marginRight="20px">
          <Text
            textAlign="center"
            color="white"
            fontWeight={400}
            fontSize="48px"
            lineHeight="48px"
          >
            {forwardTitle}
          </Text>
        </Row>
      )}
      <MarqueeBody>
        <MarqueeGroup speed={elmSpeed ?? 20}>
          {data?.map((value, idx) => {
            return <>{value}</>;
          })}
        </MarqueeGroup>
        <MarqueeGroup speed={elmSpeed ?? 20}>
          {data?.map((value, idx) => {
            return <>{value}</>;
          })}
        </MarqueeGroup>
      </MarqueeBody>
    </MarqueeCtr>
  );
};

const scrollX = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const MarqueeCtr = styled.div`
  display: flex;
  justify-content: center;
  margin: 0rem 0rem 1rem 0rem;
  padding: 0.8rem;
  gap: 1rem;
  width: 100%;
`;

const MarqueeBody = styled.div`
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
  user-select: none;
  width: 100%;
  max-width: 98%;
  position: relative;
  mask-image: linear-gradient(
    to right,
    hsl(0 0% 0% / 0),
    hsl(0 0% 0% / 1) 10%,
    hsl(0 0% 0% / 1) 90%,
    hsl(0 0% 0% / 0)
  );
`;
const MarqueeGroup = styled.div<{ speed: number }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: space-around;
  min-width: 100%;
  animation: ${scrollX} ${(props) => `${props?.speed}s linear infinite;`};
  gap: 1.5px;
  padding: 0 1rem;
  @media (max-width: 1200px) {
    gap: 12px;
  }
`;

export default Marquee;
