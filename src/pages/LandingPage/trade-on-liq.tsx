import React from "react";
import styled from "styled-components";
import { Column, Row } from "../../components/Layout";
import { Text } from "../../components/Text";
import Button from "../../components/Button/MainButton";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";
import Spacer from "../../components/Spacer";
import { formatNumber } from "../../utils/formatNumber";
import { AutoRow } from "../../components/Layout/Row";
import Trade1 from "img/landingpage/decoration/trade1.png";
import Trade2 from "img/landingpage/decoration/trade2.png";
import Trade3 from "img/landingpage/decoration/trade3.png";
import BgTrade1 from "img/landingpage/bg/bg-trade1.png";
import BgTrade2 from "img/landingpage/bg/bg-trade2.png";
import BgTrade3 from "img/landingpage/bg/bg-trade3.png";

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
              Why Trade On LIQ?
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
              LIQ Finance aims to provide a permissionless, decentralized manner of trading perpetuals on-chain. Without
              KYC and giving up custody, traders can enjoy superior security while trading perpetuals completely
              on-chain.
            </Text>
          </Column>

          <AutoRow gap="50px" justify="center">
            {[
              {
                icon: Trade1,
                iconBg: BgTrade1,
                title: "Your Keys, Your Assets",
                desc: "Trade and earn cryptocurrencies with lowest fees, depthless liquidity, and up to 100x leverage. Generate yield in a bull, bear, or sideways market.",
              },
              {
                icon: Trade2,
                iconBg: BgTrade2,
                title: "Zero Price Effect",
                desc: "Trade and earn cryptocurrencies with lowest fees, depthless liquidity, and up to 100x leverage. Generate yield in a bull, bear, or sideways market.",
              },
              {
                icon: Trade3,
                iconBg: BgTrade3,
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
