import { Trans } from "@lingui/macro";
import TokenCard from "components/TokenCard/TokenCard";
import { getStatsAPIUrl } from "config/backend";
import costIcon from "img/ic_cost.svg";
import liquidityIcon from "img/ic_liquidity.svg";
import simpleSwapIcon from "img/ic_simpleswaps.svg";
import statsIcon from "img/ic_stats.svg";
import totaluserIcon from "img/ic_totaluser.svg";
import tradingIcon from "img/ic_trading.svg";
import { useChainId } from "lib/chains";
import { arrayURLFetcher } from "lib/legacy";
import { formatAmount } from "lib/numbers";
import useSWR from "swr";
import "./Home.css";

export default function Home({ showRedirectModal, redirectPopupTimestamp }) {
  const { chainId } = useChainId();
  // const [openedFAQIndex, setOpenedFAQIndex] = useState(null)
  // const faqContent = [{
  //   id: 1,
  //   question: "What is Liq?",
  //   answer: "Liq is a decentralized spot and perpetual exchange that supports low swap fees and zero price impact trades.<br><br>Trading is supported by a unique multi-asset pool that earns liquidity providers fees from market making, swap fees, leverage trading (spreads, funding fees & liquidations), and asset rebalancing.<br><br>Dynamic pricing is supported by Chainlink Oracles along with TWAP pricing from leading volume DEXs."
  // }, {
  //   id: 2,
  //   question: "What is the Liq Governance Token? ",
  //   answer: "The LIQ token is the governance token of the Liq ecosystem, it provides the token owner voting rights on the direction of the Liq platform.<br><br>Additionally, when Liq is staked you will earn 30% of the platform-generated fees, you will also earn Escrowed LIQLIQ tokens and Multiplier Points."
  // }, {
  //   id: 3,
  //   question: "What is the GLP Token? ",
  //   answer: "The GLP token represents the liquidity users provide to the Liq platform for Swaps and Margin Trading.<br><br>To provide liquidity to GLP you <a href='https://liq.markets/liquidity' target='_blank'>trade</a> your crypto asset BTC, ETH, LINK, UNI, USDC, USDT, MIM, or FRAX to the liquidity pool, in exchange, you gain exposure to a diversified index of tokens while earning 50% of the platform trading fees and esLIQ."
  // }, {
  //   id: 4,
  //   question: "What can I Trade on Liq? ",
  //   answer: "On Liq you can swap or margin trade any of the following assets: ETH, BTC, LINK, UNI, USDC, USDT, MIM, FRAX, with others to be added. "
  // }]

  // const toggleFAQContent = function(index) {
  //   if (openedFAQIndex === index) {
  //     setOpenedFAQIndex(null)
  //   } else {
  //     setOpenedFAQIndex(index)
  //   }
  // }
  const { data: dataStats } = useSWR(getStatsAPIUrl(chainId, "/app-stats"), {
    fetcher: arrayURLFetcher,
  });
  // ARBITRUM

  // const arbitrumPositionStatsUrl = getServerUrl(ARBITRUM, "/position_stats");
  // const { data: arbitrumPositionStats } = useSWR([arbitrumPositionStatsUrl], {
  //   fetcher: (...args) => fetch(...args).then((res) => res.json()),
  // });

  // const arbitrumTotalVolumeUrl = getServerUrl(ARBITRUM, "/total_volume");
  // const { data: arbitrumTotalVolume } = useSWR([arbitrumTotalVolumeUrl], {
  //   fetcher: (...args) => fetch(...args).then((res) => res.json()),
  // });

  // AVALANCHE

  // const avalanchePositionStatsUrl = getServerUrl(AVALANCHE, "/position_stats");
  // const { data: avalanchePositionStats } = useSWR([avalanchePositionStatsUrl], {
  //   fetcher: (...args) => fetch(...args).then((res) => res.json()),
  // });

  // const avalancheTotalVolumeUrl = getServerUrl(AVALANCHE, "/total_volume");
  // const { data: avalancheTotalVolume } = useSWR([avalancheTotalVolumeUrl], {
  //   fetcher: (...args) => fetch(...args).then((res) => res.json()),
  // });

  // Total Volume

  // const arbitrumTotalVolumeSum = getTotalVolumeSum(arbitrumTotalVolume);
  // const avalancheTotalVolumeSum = getTotalVolumeSum(avalancheTotalVolume);

  // let totalVolumeSum = bigNumberify(0);
  // if (arbitrumTotalVolumeSum && avalancheTotalVolumeSum) {
  //   totalVolumeSum = totalVolumeSum.add(arbitrumTotalVolumeSum);
  //   totalVolumeSum = totalVolumeSum.add(avalancheTotalVolumeSum);
  // }

  // Open Interest

  // let openInterest = bigNumberify(0);
  // if (
  //   arbitrumPositionStats &&
  //   arbitrumPositionStats.totalLongPositionSizes &&
  //   arbitrumPositionStats.totalShortPositionSizes
  // ) {
  //   openInterest = openInterest.add(arbitrumPositionStats.totalLongPositionSizes);
  //   openInterest = openInterest.add(arbitrumPositionStats.totalShortPositionSizes);
  // }

  // if (
  //   avalanchePositionStats &&
  //   avalanchePositionStats.totalLongPositionSizes &&
  //   avalanchePositionStats.totalShortPositionSizes
  // ) {
  //   openInterest = openInterest.add(avalanchePositionStats.totalLongPositionSizes);
  //   openInterest = openInterest.add(avalanchePositionStats.totalShortPositionSizes);
  // }

  // user stat
  // const arbitrumUserStats = useUserStat(ARBITRUM);
  // const avalancheUserStats = useUserStat(AVALANCHE);
  // let totalUsers = 0;

  // if (arbitrumUserStats && arbitrumUserStats.uniqueCount) {
  //   totalUsers += arbitrumUserStats.uniqueCount;
  // }

  // if (avalancheUserStats && avalancheUserStats.uniqueCount) {
  //   totalUsers += avalancheUserStats.uniqueCount;
  // }

  const LaunchExchangeButton = () => {
    return (
      // <HeaderLink
      //   className="default-btn"
      //   to="/trade"
      //   redirectPopupTimestamp={redirectPopupTimestamp}
      //   showRedirectModal={showRedirectModal}
      // >
      //   <Trans>Launch App</Trans>
      // </HeaderLink>
      <a className="default-btn" href="/#/trade">
        <Trans>Launch App</Trans>
      </a>
    );
  };

  return (
    <div className="Home">
      <div className="Home-top">
        {/* <div className="Home-top-image"></div> */}
        <div className="Home-title-section-container default-container">
          <div className="Home-title-section">
            <div className="Home-title">
              <Trans>
                Decentralized
                <br />
                Perpetual Exchange
              </Trans>
            </div>
            <div className="Home-description">
              <Trans>
                Trade BTC, ETH, ETH and other top cryptocurrencies with up to 50x leverage directly from your wallet
              </Trans>
            </div>
            <LaunchExchangeButton />
          </div>
        </div>
        <div className="Home-latest-info-container default-container">
          <div className="Home-latest-info-block">
            <img src={tradingIcon} alt="Total Trading Volume Icon" className="Home-latest-info__icon" />
            <div className="Home-latest-info-content">
              <div className="Home-latest-info__title">
                <Trans>Total Trading Volume</Trans>
              </div>
              {/* <div className="Home-latest-info__value">${formatAmount(totalVolumeSum, USD_DECIMALS, 0, true)}</div> */}
              <div className="Home-latest-info__value">
                ${dataStats?.[0].totalVolume ? formatAmount(dataStats?.[0].totalVolume, 30, 0, true) : "--"}
              </div>
            </div>
          </div>
          <div className="Home-latest-info-block">
            <img src={statsIcon} alt="Open Interest Icon" className="Home-latest-info__icon" />
            <div className="Home-latest-info-content">
              <div className="Home-latest-info__title">
                <Trans>Open Interest</Trans>
              </div>
              {/* <div className="Home-latest-info__value">${formatAmount(openInterest, USD_DECIMALS, 0, true)}</div> */}
              <div className="Home-latest-info__value">
                ${dataStats?.[0].openInterest ? formatAmount(dataStats?.[0].openInterest, 30, 2, true) : "--"}
              </div>
            </div>
          </div>
          <div className="Home-latest-info-block">
            <img src={totaluserIcon} alt="Total Users Icon" className="Home-latest-info__icon" />
            <div className="Home-latest-info-content">
              <div className="Home-latest-info__title">
                <Trans>Total Users</Trans>
              </div>
              {/* <div className="Home-latest-info__value">{numberWithCommas(totalUsers.toFixed(0))}</div> */}
              <div className="Home-latest-info__value">
                {formatAmount(dataStats?.[0]?.totalUsers || 0, 0, 0, false)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="Home-benefits-section">
        <div className="Home-benefits default-container">
          <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={liquidityIcon} alt="Reduce Liquidation Risks Icon" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Reduce Liquidation Risks</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
                An aggregate of high-quality price feeds determine when liquidations occur. This keeps positions safe
                from temporary wicks.
              </Trans>
            </div>
          </div>
          <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={costIcon} alt="Save on Costs Icon" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Save on Costs</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
                Enter and exit positions with minimal spread and zero price impact. Get the optimal price without
                incurring additional costs.
              </Trans>
            </div>
          </div>
          <div className="Home-benefit">
            <div className="Home-benefit-icon">
              <img src={simpleSwapIcon} alt="Simple Swaps Icon" className="Home-benefit-icon-symbol" />
              <div className="Home-benefit-title">
                <Trans>Simple Swaps</Trans>
              </div>
            </div>
            <div className="Home-benefit-description">
              <Trans>
                Open positions through a simple swap interface. Conveniently swap from any supported asset into the
                position of your choice.
              </Trans>
            </div>
          </div>
        </div>
      </div>
      <div className="Home-token-card-section">
        <div className="Home-token-card-container default-container">
          <div className="Home-token-card-info">
            <div className="Home-token-card-info__title">
              <Trans>Ecosystem tokens</Trans>
            </div>
          </div>
          <TokenCard showRedirectModal={showRedirectModal} redirectPopupTimestamp={redirectPopupTimestamp} />
        </div>
      </div>

      {/* <div className="Home-video-section">
        <div className="Home-video-container default-container">
          <div className="Home-video-block">
            <img src={liqBigIcon} alt="mmybig" />
          </div>
        </div>
      </div> */}
      {/* <div className="Home-faqs-section">
        <div className="Home-faqs-container default-container">
          <div className="Home-faqs-introduction">
            <div className="Home-faqs-introduction__title">FAQs</div>
            <div className="Home-faqs-introduction__description">Most asked questions. If you wish to learn more, please head to our Documentation page.</div>
            <a href="docs.liq.markets/" className="default-btn Home-faqs-documentation">Documentation</a>
          </div>
          <div className="Home-faqs-content-block">
            {
              faqContent.map((content, index) => (
                <div className="Home-faqs-content" key={index} onClick={() => toggleFAQContent(index)}>
                  <div className="Home-faqs-content-header">
                    <div className="Home-faqs-content-header__icon">
                      {
                        openedFAQIndex === index ? <FiMinus className="opened" /> : <FiPlus className="closed" />
                      }
                    </div>
                    <div className="Home-faqs-content-header__text">
                      { content.question }
                    </div>
                  </div>
                  <div className={ openedFAQIndex === index ? "Home-faqs-content-main opened" : "Home-faqs-content-main" }>
                    <div className="Home-faqs-content-main__text">
                      <div dangerouslySetInnerHTML={{__html: content.answer}} >
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div> */}
    </div>
  );
}
