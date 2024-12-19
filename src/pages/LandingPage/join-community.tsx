import Bgview from "img/ic-communityproject.svg";
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

const PoistionImg = styled.img`
  width: 250px;
  height: 250px;
  position: absolute;
  right: -100px;
  top: 40px;
`;

const ImagesWrapper = styled.div`
  position: relative;
  width: 353px;
  height: 353px;
`;

function JoinCommunity() {
  const { isTablet } = useMatchBreakPoints();
  return (
    <TradeOverviewWrapper>
      <Row width="100%" justify="center" align="center" gap="10%">
        <Column
          width={isTablet ? "86%" : "500px"}
          gap="24px"
          justify={isTablet ? "center" : "flex-start"}
          align={isTablet ? "center" : "left"}
        >
          <Text
            fontSize="48px"
            fontFamily="ClashDisplay-Medium"
            fontWeight={400}
            lineHeight={isTablet ? "36px" : "53px"}
          >
            Unite with our Collective
          </Text>
          <Text
            fontSize="20px"
            fontFamily="Neue Haas Grotesk Display Pro"
            fontWeight={400}
            lineHeight="23px"
            letterSpacing="0.96px"
            color="#8D8D8D"
          >
            We are creating a community of forward-thinking users and investors, eager to lead the way in shaping the
            future of Web3 markets.
          </Text>
          <a href={SOCIAL_INFO.discord} target="_blank">
            <Button isFilled={false} style={{ marginTop: "10px" }}>
              Join Discord
            </Button>
          </a>
        </Column>
        {!isTablet && (
          <ImagesWrapper>
            <PoistionImg src={Bgview} />
          </ImagesWrapper>
        )}
      </Row>
    </TradeOverviewWrapper>
  );
}

export default JoinCommunity;
