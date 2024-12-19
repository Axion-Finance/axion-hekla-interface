import styled from "styled-components";
import { Column, Row } from "../../components/Layout";
import { AutoRow } from "../../components/Layout/Row";
import { Text } from "../../components/Text";
import { formatNumber } from "../../utils/formatNumber";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";

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
          <Text color="#e81899">IN AXION WE TRUST</Text>
          <Text
            fontSize="48px"
            textAlign="center"
            fontFamily="ClashDisplay-Medium"
            fontWeight={400}
            lineHeight={isTablet ? "36px" : "53px"}
          >
            Trusted by over <span color="#e81899"> 16,582</span> Traders
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
