import styled from "styled-components";
import BuildOn from "./build-on";
import JoinCommunity from "./join-community";
import TitlePageView from "./title-view";
import TradeOnLiq from "./trade-on-axion";
import TradeOverview from "./trade-overview";

const HomeWrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;
LandingPage.propTypes = {};

function LandingPage() {
  return (
    <HomeWrapper>
      <TitlePageView />
      <TradeOverview />
      <TradeOnLiq />
      <BuildOn />
      <JoinCommunity />
    </HomeWrapper>
  );
}

export default LandingPage;
