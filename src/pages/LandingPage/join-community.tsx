import styled from "styled-components";
import Button from "../../components/Button/MainButton";
import { Column, Row } from "../../components/Layout";
import { Text } from "../../components/Text";
import { SOCIAL_INFO } from "../../config/constant";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";

const TradeOverviewWrapper = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 5% 10% 10% 0%;
  @media (max-width: 1200px) {
    padding: 20% 0%;
  }
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
      </Row>
    </TradeOverviewWrapper>
  );
}

export default JoinCommunity;
