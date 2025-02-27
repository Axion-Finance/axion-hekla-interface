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
  background-color: #0f0f0f;
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
              Trade and profit from cryptocurrencies with minimal fees, infinite liquidity, and leverage up to 100x
              leverage. Earn yields in rising, falling, or flat markets.
            </Text>
            <Text
              fontSize={isTablet ? "40px" : "73px"}
              textAlign="center"
              fontFamily="ClashDisplay-Medium"
              fontWeight={400}
              lineHeight={isTablet ? "36px" : "69px"}
              fontStyle="normal"
              color="white"
            >
              Decentralized Derivatives Trading Platform
            </Text>
            <Row width="fit-content" gap="20px" padding="20px">
              <a href={SOCIAL_INFO.discord} target="_blank">
                <Button isFilled={false}>Join The Community</Button>
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
