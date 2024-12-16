import styled from "styled-components";
import Button from "../../components/Button/MainButton";
import { Column, Row } from "../../components/Layout";
import { AutoRow } from "../../components/Layout/Row";
import { Text } from "../../components/Text";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";

const TradeOverviewWrapper = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
`;

const LogoBG = styled.div<{ bgURL: string }>`
  width: 87px;
  height: 87px;
  flex-shrink: 0;
  border-radius: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ bgURL }) => (bgURL ? `url(${bgURL})` : "")};
`;

function TradeOnLiq() {
  const { isTablet } = useMatchBreakPoints();
  return (
    <TradeOverviewWrapper>
      <Row width="100%" justify="center" align="center">
        <Column padding={isTablet ? "6% 10% 26% 10%" : "4% 18%"} gap={"38px"}>
          <Button>WHY WHY WHY</Button>
          <Column padding="0px" gap={isTablet ? "18px" : "20px"}>
            <Text
              fontSize="48px"
              textAlign="center"
              fontFamily="Sequel100Black-65"
              fontWeight={400}
              lineHeight={isTablet ? "36px" : "53px"}
              textTransform="uppercase"
            >
              Why Trade On AXION?
            </Text>
            <Text
              fontSize="20px"
              textAlign="center"
              fontFamily="Neue Haas Grotesk Display Pro"
              fontWeight={400}
              lineHeight="23px"
              letterSpacing="1.2px"
              color="#8D8D8D"
            >
              AXION Finance aims to provide a permissionless, decentralized manner of trading perpetuals on-chain.
              Without KYC and giving up custody, traders can enjoy superior security while trading perpetuals completely
              on-chain.
            </Text>
          </Column>

          <AutoRow gap="50px" justify="center">
            {[
              {
                icon: "",
                iconBg: "",
                title: "Your Keys, Your Assets",
                desc: "Trade and earn cryptocurrencies with lowest fees, depthless liquidity, and up to 100x leverage. Generate yield in a bull, bear, or sideways market.",
              },
              {
                icon: "",
                iconBg: "",
                title: "Zero Price Effect",
                desc: "Trade and earn cryptocurrencies with lowest fees, depthless liquidity, and up to 100x leverage. Generate yield in a bull, bear, or sideways market.",
              },
              {
                icon: "",
                iconBg: "",
                title: "Truly Composable",
                desc: "KTX Finance is built to be integrated by any DeFi protocol without compromising decentralization, efficiency, and security.",
              },
            ].map((element) => {
              return (
                <Column gap="4px" padding="0px 1%">
                  <LogoBG bgURL={element.iconBg}>
                    <img src={element.icon} />
                  </LogoBG>
                  <Text
                    fontSize="16px"
                    textAlign="center"
                    fontFamily="Sequel100Black-45"
                    fontWeight={400}
                    lineHeight="21px"
                    textTransform="uppercase"
                    fontStyle="normal"
                    paddingBottom="10px"
                  >
                    {element.title}
                  </Text>
                  <Text
                    fontSize="16px"
                    textAlign="center"
                    fontFamily="Neue Haas Grotesk Display Pro"
                    fontWeight={400}
                    lineHeight="20px"
                    letterSpacing="0.96px"
                    fontStyle="normal"
                    color="#8D8D8D"
                  >
                    {element.desc}
                  </Text>
                </Column>
              );
            })}
          </AutoRow>
        </Column>
      </Row>
    </TradeOverviewWrapper>
  );
}

export default TradeOnLiq;
