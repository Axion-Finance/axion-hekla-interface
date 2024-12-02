import React from "react";
import styled from "styled-components";
import { Column, Row } from "../../components/Layout";
import { Text } from "../../components/Text";
import Button from "../../components/Button/MainButton";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";
import Spacer from "../../components/Spacer";
import { formatNumber } from "../../utils/formatNumber";
import { AutoRow, RowWrap } from "../../components/Layout/Row";

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

function TradeOverview() {
  const { isTablet } = useMatchBreakPoints();
  return (
    <TradeOverviewWrapper>
      <Row width="100%" justify="center" align="center">
        <Column padding="148px 10%" gap="38px">
          <Button>IN LIQ WE TRUST</Button>
          <Text
            fontSize="48px"
            textAlign="center"
            fontFamily="Sequel100Black-65"
            fontWeight={400}
            lineHeight={isTablet ? "36px" : "53px"}
            textTransform="uppercase"
          >
            Trusted by over 16,582 Traders
          </Text>
          <AutoRow gap="30px">
            {[
              { title: "Trading Volume", value: 11178144999, isUSD: true },
              { title: "Traders", value: 18569 },
              { title: "Open Interest", value: 1240051, isUSD: true },
            ].map((element) => {
              return (
                <Column gap={isTablet ? "16px" : "26px"}>
                  <Text
                    fontSize="16px"
                    textAlign="center"
                    fontFamily="Neue Haas Grotesk Display Pro"
                    fontWeight={900}
                    lineHeight="16px"
                    color="#8D8D8D"
                  >
                    {element.title}
                  </Text>
                  <Text
                    fontSize="43px"
                    textAlign="center"
                    fontFamily="Neue Haas Grotesk Display Pro"
                    fontWeight={400}
                    lineHeight="16px"
                    textTransform="uppercase"
                  >
                    {element.isUSD && "$"}
                    {formatNumber(element.value, 0)}
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

export default TradeOverview;
