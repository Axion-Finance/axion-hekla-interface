import React from "react";
import styled from "styled-components";
import { Column, Row } from "../../components/Layout";
import { Text } from "../../components/Text";
import Button from "../../components/Button/MainButton";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";
import Spacer from "../../components/Spacer";
import { formatNumber } from "../../utils/formatNumber";
import { Link } from "react-router-dom";
import { SOCIAL_INFO } from "../../config/constant";
import BgRound1 from "img/landingpage/bg/bg-round1.png";
import BgRound2 from "img/landingpage/bg/bg-round2.png";
import BgRound3 from "img/landingpage/bg/bg-round3.png";
import BgRound4 from "img/landingpage/bg/bg-round4.png";

const TradeOverviewWrapper = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 5% 10% 10% 0%;
  @media (max-width: 1200px) {
    padding: 20% 0%;
  }
`;

const ImagesWrapper = styled.div`
  position: relative;
  background: url(${BgRound1});
  width: 353px;
  height: 353px;
`;

const PoistionImg2 = styled.img`
  width: 151.394px;
  height: 142.809px;
  position: absolute;
  right: 80px;
  top: 40px;
`;

const PoistionImg3 = styled.img`
  width: 149px;
  height: 149px;
  position: absolute;
  bottom: 10px;
  right: -90px;
`;
const PoistionImg4 = styled.img`
  width: 206px;
  height: 207px;
  position: absolute;
  bottom: -70px;
  left: -40px;
`;

function JoinCommunity() {
  const { isTablet } = useMatchBreakPoints();
  return (
    <TradeOverviewWrapper>
      <Row width="100%" justify="center" align="center" gap="10%">
        <Column
          width={isTablet ? "86%" : "min-content"}
          gap="24px"
          justify={isTablet ? "center" : "flex-start"}
          align={isTablet ? "center" : "left"}
        >
          <Text
            fontSize="48px"
            fontFamily="Sequel100Black-65"
            fontWeight={400}
            lineHeight={isTablet ? "36px" : "53px"}
            textTransform="uppercase"
          >
            Join our COLLECTIVE
          </Text>
          <Text
            fontSize="20px"
            fontFamily="Neue Haas Grotesk Display Pro"
            fontWeight={400}
            lineHeight="23px"
            letterSpacing="0.96px"
            color="#8D8D8D"
          >
            We are building a community of innovative, boundary-pushing users and investors who are ready to pioneer the
            new frontier of Web3 markets.
          </Text>
          <a href={SOCIAL_INFO.discord} target="_blank">
            <Button style={{ backgroundColor: "#110204", marginTop: "10px" }}>JOIN DISCORD</Button>
          </a>
        </Column>
        {!isTablet && (
          <ImagesWrapper>
            <PoistionImg2 src={BgRound3} />
            <PoistionImg3 src={BgRound2} />
            <PoistionImg4 src={BgRound4} />
          </ImagesWrapper>
        )}
      </Row>
    </TradeOverviewWrapper>
  );
}

export default JoinCommunity;
