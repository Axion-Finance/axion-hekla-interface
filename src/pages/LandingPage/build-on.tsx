import React from "react";
import styled from "styled-components";
import { Column, Row } from "../../components/Layout";
import { Text } from "../../components/Text";
import Button from "../../components/Button/MainButton";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";
import Spacer from "../../components/Spacer";
import { formatNumber } from "../../utils/formatNumber";
import { Link } from "react-router-dom";
import { RowWrap } from "../../components/Layout/Row";
import Mode from "img/landingpage/chains/mode.svg";
import Optimism from "img/landingpage/chains/optimism.svg";
import Kroma from "img/landingpage/chains/kroma.svg";
import Linea from "img/landingpage/chains/linea.svg";

const TradeOverviewWrapper = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Logo = styled.img`
  width: 91px;
  height: 31px;
  padding: 40px;
  background: url(../images/bg/bg1.png);
`;

function TradeOnLiq() {
  const { isTablet } = useMatchBreakPoints();
  return (
    <TradeOverviewWrapper>
      <Row width="100%" justify="center" align="center">
        <Column padding="6% 8%" gap="40px">
          <Text
            fontSize="48px"
            textAlign="center"
            fontFamily="Sequel100Black-65"
            fontWeight={400}
            lineHeight="53px"
            textTransform="uppercase"
          >
            BUILD ON :
          </Text>
          <RowWrap gap="8px" justify="center">
            {[
              {
                icon: Mode,
                url: "https://www.mode.network/",
              },
              {
                icon: Optimism,
                url: "https://www.optimism.io/",
              },
              {
                icon: Kroma,
                url: "https://kroma.network/",
              },
              {
                icon: Linea,
                url: "https://linea.build/",
              },
            ].map((element) => {
              return (
                <a href={element.url} target="_blank">
                  <img src={element.icon} width={isTablet ? "82px" : "auto"} height={isTablet ? "30px" : "auto"} />
                </a>
              );
            })}
          </RowWrap>
        </Column>
      </Row>
    </TradeOverviewWrapper>
  );
}

export default TradeOnLiq;
