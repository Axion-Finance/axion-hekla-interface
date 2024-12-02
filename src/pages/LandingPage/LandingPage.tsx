import styled from "styled-components";
import Animationview from "./animationview";
import TradeOverview from "./trade-overview";
import BuildOn from "./build-on";
import TradeOnLiq from "./trade-on-liq";
import JoinCommunity from "./join-community";
import TitlePageView from "./title-view";

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
