import { RowWrap } from "components/Layout/Row";
import styled from "styled-components";
import { Column, Row } from "../../components/Layout";
import { Text } from "../../components/Text";
import Taiko from "../../img/landingpage/logos/taiko-h-wht.png";
import useMatchBreakPoints from "../../utils/useMatchBreakPoints";

const TradeOverviewWrapper = styled.div`
  width: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #0f0f0f;
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
          <RowWrap gap="12px" justify="center">
            <Text fontSize="48px" textAlign="center" fontFamily="ClashDisplay-Medium" fontWeight={400}>
              Build On :
            </Text>
            {[
              {
                icon: Taiko,
                url: "https://taiko.xyz/",
              },
            ].map((element) => {
              return (
                <a href={element.url} target="_blank">
                  <img src={element.icon} width={isTablet ? "82px" : "200px"} height={isTablet ? "30px" : "auto"} />
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
