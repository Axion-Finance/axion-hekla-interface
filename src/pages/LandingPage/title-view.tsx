import Light_Logo from "img/landingpage/logos/logo-light.png";
import styled from "styled-components";
import Button from "../../components/Button/MainButton";
import { Column, Row } from "../../components/Layout";
import { Text } from "../../components/Text";
import { SOCIAL_INFO } from "../../config/constant";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";

const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  // max-height: 704px;  #TODO: ENABLE
  position: relative;
`;
const TitlePageWrapper = styled.div`
  z-index: 10;
  width: 100%;
  text-align: center;
  flex-direction: column;
  align-items: center;
  display: flex;
  position: absolute;
  top: 0%;
  bottom: auto;
  left: 0%;
  right: auto;
`;

const Logo = styled.img`
  width: 91px;
  height: 31px;
  padding: 40px;
`;

function TitlePageView() {
  const { isTablet } = useMatchBreakPoints();
  return (
    <PageWrapper>
      <TitlePageWrapper>
        <Row width="100%" justify="left" align="center">
          <Logo src={Light_Logo} />
        </Row>
        <Row
          width="100%"
          height="calc(calc(100vh + 267px) / 2)" // height="calc(calc(100vh + 67px) / 2)" TODO: ENABLE
          justify="center"
          align="center"
        >
          <Column width={isTablet ? "80%" : "40%"} gap="18px">
            <Text
              fontSize="22px"
              textAlign="center"
              fontFamily="Neue Haas Grotesk Display Pro"
              fontWeight={600}
              lineHeight="25px"
              letterSpacing="1.2px"
            >
              Trade and earn cryptocurrencies with lowest fees, depthless liquidity, and up to 100x leverage. Generate
              yield in a bull, bear, or sideways market.
            </Text>
            <Text
              fontSize={isTablet ? "60px" : "93px"}
              textAlign="center"
              fontFamily="Sequel100Black-65"
              fontWeight={400}
              lineHeight={isTablet ? "46px" : "79px"}
              fontStyle="normal"
              color="white"
            >
              DECENTRALIZED DERIVATIVES EXCHANGE
            </Text>
            <Row width="fit-content" gap="20px" padding="20px">
              <a href={SOCIAL_INFO.discord} target="_blank">
                <Button>JOIN THE COMMUNITY</Button>
              </a>
              {/* <Button width="140px" isFilled={true} disabled={true}>
                  AIRDROP
                </Button> */}
            </Row>
          </Column>
        </Row>
      </TitlePageWrapper>
    </PageWrapper>
  );
}

export default TitlePageView;
