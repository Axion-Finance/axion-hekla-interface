import { Trans, t } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import LlpManager from "abis/LlpManager.json";
import ReaderV2 from "abis/ReaderV2.json";
import VaultV2 from "abis/VaultV2.json";
import SEO from "components/Common/SEO";
import ExternalLink from "components/ExternalLink/ExternalLink";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import TooltipComponent from "components/Tooltip/Tooltip";
import { getStatsAPIUrl } from "config/backend";
import { ARBITRUM, AVALANCHE, TAIKO_MAINNET, getChainName } from "config/chains";
import { getContract } from "config/contracts";
import { GLP_POOL_COLORS, /*getTokenBySymbol,*/ getWhitelistedTokens } from "config/tokens";
//import { useLiqPrice, useTotalLiqInLiquidity, useTotalLiqStaked } from "domain/legacy";
import { useInfoTokens } from "domain/tokens";
import { ethers } from "ethers";
import hexToRgba from "hex-to-rgba";
import {
  default as arbitrum16Icon,
  default as arbitrum24Icon,
  default as avalanche24Icon,
  default as ftm24Icon,
  default as taikoIcon,
} from "img/167000.png";
import avalanche16Icon from "img/ic_avalanche_16.svg";
import llp40Icon from "img/ic_llp_40.svg";
import { useChainId } from "lib/chains";
import { contractFetcher } from "lib/contracts";
import {
  BASIS_POINTS_DIVISOR,
  DEFAULT_MAX_USDG_AMOUNT,
  GLP_DECIMALS,
  // LIQ_DECIMALS,
  USD_DECIMALS,
  arrayURLFetcher,
  getPageTitle,
  importImage,
} from "lib/legacy";
import { bigNumberify, expandDecimals, formatAmount, formatKeyAmount } from "lib/numbers";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import useSWR from "swr";
import AssetDropdown from "./AssetDropdown";
import "./DashboardV2.css";

// const ACTIVE_CHAIN_IDS = [TAIKO_MAINNET];

const { AddressZero } = ethers.constants;

// function getVolumeInfo(hourlyVolumes) {
//   if (!hourlyVolumes || hourlyVolumes.length === 0) {
//     return {};
//   }
//   const dailyVolumes = hourlyVolumes.map((hourlyVolume) => {
//     const secondsPerHour = 60 * 60;
//     const minTime = parseInt(Date.now() / 1000 / secondsPerHour) * secondsPerHour - 24 * secondsPerHour;
//     const info = {};
//     let totalVolume = bigNumberify(0);
//     for (let i = 0; i < hourlyVolume.length; i++) {
//       const item = hourlyVolume[i].data;
//       if (parseInt(item.timestamp) < minTime) {
//         break;
//       }

//       if (!info[item.token]) {
//         info[item.token] = bigNumberify(0);
//       }

//       info[item.token] = info[item.token].add(item.volume);
//       totalVolume = totalVolume.add(item.volume);
//     }
//     info.totalVolume = totalVolume;
//     return info;
//   });
//   return dailyVolumes.reduce(
//     (acc, cv, index) => {
//       acc.totalVolume = acc.totalVolume.add(cv.totalVolume);
//       acc[ACTIVE_CHAIN_IDS[index]] = cv;
//       return acc;
//     },
//     { totalVolume: bigNumberify(0) }
//   );
// }

// function getPositionStats(positionStats) {
//   if (!positionStats || positionStats.length === 0) {
//     return null;
//   }
//   return positionStats.reduce(
//     (acc, cv, i) => {
//       acc.totalLongPositionSizes = acc.totalLongPositionSizes.add(cv.totalLongPositionSizes);
//       acc.totalShortPositionSizes = acc.totalShortPositionSizes.add(cv.totalShortPositionSizes);
//       acc[ACTIVE_CHAIN_IDS[i]] = cv;
//       return acc;
//     },
//     {
//       totalLongPositionSizes: bigNumberify(0),
//       totalShortPositionSizes: bigNumberify(0),
//     }
//   );
// }

// function getCurrentFeesUsd(tokenAddresses, fees, infoTokens) {
//   if (!fees || !infoTokens) {
//     return bigNumberify(0);
//   }

//   let currentFeesUsd = bigNumberify(0);
//   for (let i = 0; i < tokenAddresses.length; i++) {
//     const tokenAddress = tokenAddresses[i];
//     const tokenInfo = infoTokens[tokenAddress];
//     if (!tokenInfo || !tokenInfo.contractMinPrice) {
//       continue;
//     }

//     const feeUsd = fees[i].mul(tokenInfo.contractMinPrice).div(expandDecimals(1, tokenInfo.decimals));
//     currentFeesUsd = currentFeesUsd.add(feeUsd);
//   }

//   return currentFeesUsd;
// }

export default function DashboardV2() {
  const { active, library } = useWeb3React();
  const { chainId } = useChainId();
  // const totalVolume = useTotalVolume();

  const chainName = getChainName(chainId);
  const url = getStatsAPIUrl(chainId, "/app-stats");
  const { data: dataStats } = useSWR(url, {
    fetcher: arrayURLFetcher,
  });
  // console.log('####dataStats',dataStats);
  // const { data: positionStats } = useSWR(
  //   ACTIVE_CHAIN_IDS.map((chainId) => getServerUrl(chainId, "/position_stats")),
  //   {
  //     fetcher: arrayURLFetcher,
  //   }
  // );

  // const { data: hourlyVolumes } = useSWR(
  //   ACTIVE_CHAIN_IDS.map((chainId) => getServerUrl(chainId, "/hourly_volume")),
  //   {
  //     fetcher: arrayURLFetcher,
  //   }
  // );

  // const currentVolumeInfo = getVolumeInfo(hourlyVolumes);

  // const positionStatsInfo = getPositionStats(positionStats);

  // function getWhitelistedTokenAddresses(chainId) {
  //   const whitelistedTokens = getWhitelistedTokens(chainId);
  //   return whitelistedTokens.map((token) => token.address);
  // }

  const whitelistedTokens = getWhitelistedTokens(chainId);
  const tokenList = whitelistedTokens.filter((t) => !t.isWrapped);
  const visibleTokens = tokenList.filter((t) => !t.isTempHidden);

  const readerAddress = getContract(chainId, "Reader");
  const vaultAddress = getContract(chainId, "Vault");
  const glpManagerAddress = getContract(chainId, "LlpManager");

  //const liqAddress = getContract(chainId, "AXION");
  const llpAddress = getContract(chainId, "LLP");
  const usdfAddress = getContract(chainId, "USDG");

  const tokensForSupplyQuery = [/*liqAddress,*/ llpAddress, usdfAddress];

  const { data: aums } = useSWR([`Dashboard:getAums:${active}`, chainId, glpManagerAddress, "getAums"], {
    fetcher: contractFetcher(library, LlpManager),
  });

  const { data: totalSupplies } = useSWR(
    [`Dashboard:totalSupplies:${active}`, chainId, readerAddress, "getTokenBalancesWithSupplies", AddressZero],
    {
      fetcher: contractFetcher(library, ReaderV2, [tokensForSupplyQuery]),
    }
  );

  const { data: totalTokenWeights } = useSWR(
    [`GlpSwap:totalTokenWeights:${active}`, chainId, vaultAddress, "totalTokenWeights"],
    {
      fetcher: contractFetcher(library, VaultV2),
    }
  );
  // let { total: totalLiqSupply } = useTotalLiqSupply();
  // let totalLiqSupply = mmyInfo BigNumber.from("10000000000000000000000000")
  // const { axionPrice } = useLiqPrice(chainId, {}, active);
  // let totalLiqSupply;
  // if (totalSupplies && totalSupplies[1]) {
  //   totalLiqSupply = totalSupplies[1];
  // }
  // const { totalLiqSupply: totalLiqSupply2, axionPrice:liqPrice2, totalSupply } = useFMXInfo();
  // console.log('###',totalLiqSupply,totalLiqSupply2);
  const { infoTokens } = useInfoTokens(library, chainId, active, undefined, undefined);
  // const { infoTokens: infoTokensArbitrum } = useInfoTokens(null, ARBITRUM, active, undefined, undefined);
  // const { infoTokens: infoTokensAvax } = useInfoTokens(null, AVALANCHE, active, undefined, undefined);

  // const { data: currentFees } = useSWR(
  //   infoTokensArbitrum[AddressZero].contractMinPrice && infoTokensAvax[AddressZero].contractMinPrice
  //     ? "Dashboard:currentFees"
  //     : null,
  //   {
  //     fetcher: () => {
  //       return Promise.all(
  //         ACTIVE_CHAIN_IDS.map((chainId) =>
  //           contractFetcher(null, ReaderV2, [getWhitelistedTokenAddresses(chainId)])(
  //             `Dashboard:fees:${chainId}`,
  //             chainId,
  //             getContract(chainId, "Reader"),
  //             "getFees",
  //             getContract(chainId, "Vault")
  //           )
  //         )
  //       ).then((fees) => {
  //         return fees.reduce(
  //           (acc, cv, i) => {
  //             const feeUSD = getCurrentFeesUsd(
  //               getWhitelistedTokenAddresses(ACTIVE_CHAIN_IDS[i]),
  //               cv,
  //               ACTIVE_CHAIN_IDS[i] === ARBITRUM ? infoTokensArbitrum : infoTokensAvax
  //             );
  //             acc[ACTIVE_CHAIN_IDS[i]] = feeUSD;
  //             acc.total = acc.total.add(feeUSD);
  //             return acc;
  //           },
  //           { total: bigNumberify(0) }
  //         );
  //       });
  //     },
  //   }
  // );

  // const { data: feesSummaryByChain } = useFeesSummary();
  // const feesSummary = feesSummaryByChain[chainId];

  //const eth = infoTokens[getTokenBySymbol(chainId, "ETH").address];
  // const shouldIncludeCurrrentFees =
  //   feesSummaryByChain[chainId].lastUpdatedAt &&
  //   parseInt(Date.now() / 1000) - feesSummaryByChain[chainId].lastUpdatedAt > 60 * 60;

  // const totalFees = ACTIVE_CHAIN_IDS.map((chainId) => {
  //   if (shouldIncludeCurrrentFees && currentFees && currentFees[chainId]) {
  //     return currentFees[chainId].div(expandDecimals(1, USD_DECIMALS)).add(feesSummaryByChain[chainId].totalFees || 0);
  //   }

  //   return feesSummaryByChain[chainId].totalFees || 0;
  // })
  //   .map((v) => Math.round(v))
  //   .reduce(
  //     (acc, cv, i) => {
  //       acc[ACTIVE_CHAIN_IDS[i]] = cv;
  //       acc.total = acc.total + cv;
  //       return acc;
  //     },
  //     { total: 0 }
  //   );

  // const { liqPriceFromArbitrum, liqPriceFromAvalanche } = useLiqPrice(
  //   chainId,
  //   { arbitrum: chainId === ARBITRUM ? library : undefined },
  //   active
  // );
  // const axionPrice = BigNumber.from("1000000000000000000000000000000")

  // let { total: totalLiqInLiquidity } = useTotalLiqInLiquidity(chainId, active);

  // let { avax: avaxStakedLiq, arbitrum: arbitrumStakedLiq, total: totalStakedLiq } = useTotalLiqStaked();

  // let liqMarketCap;
  // if (axionPrice && totalLiqSupply) {
  //   liqMarketCap = axionPrice.mul(totalLiqSupply).div(expandDecimals(1, LIQ_DECIMALS));
  // }

  // let stakedLiqSupplyUsd;
  // if (axionPrice && totalStakedLiq) {
  //   stakedLiqSupplyUsd = totalStakedLiq.mul(axionPrice).div(expandDecimals(1, LIQ_DECIMALS));
  // }

  let aum;
  if (aums && aums.length > 0) {
    aum = aums[0].add(aums[1]).div(2);
  }

  let glpPrice;
  let glpSupply;
  let glpMarketCap;
  if (aum && totalSupplies && totalSupplies[1]) {
    glpSupply = totalSupplies[1];
    glpPrice =
      aum && aum.gt(0) && glpSupply.gt(0)
        ? aum.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupply)
        : expandDecimals(1, USD_DECIMALS);
    glpMarketCap = glpPrice.mul(glpSupply).div(expandDecimals(1, GLP_DECIMALS));
  }

  let tvl;
  // if (glpMarketCap && axionPrice && totalStakedLiq) {
  //   tvl = glpMarketCap.add(axionPrice.mul(totalStakedLiq).div(expandDecimals(1, LIQ_DECIMALS)));
  // }

  if (glpMarketCap) {
    tvl = glpMarketCap;
  }

  // const ethFloorPriceFund = expandDecimals(350 + 148 + 384, 18);
  // const glpFloorPriceFund = expandDecimals(660001, 18);
  // const usdcFloorPriceFund = expandDecimals(784598 + 200000, 30);

  // let totalFloorPriceFundUsd;

  // if (eth && eth.contractMinPrice && glpPrice) {
  //   const ethFloorPriceFundUsd = ethFloorPriceFund.mul(eth.contractMinPrice).div(expandDecimals(1, eth.decimals));
  //   const glpFloorPriceFundUsd = glpFloorPriceFund.mul(glpPrice).div(expandDecimals(1, 18));

  //  totalFloorPriceFundUsd = ethFloorPriceFundUsd.add(glpFloorPriceFundUsd).add(usdcFloorPriceFund);
  // }

  let adjustedUsdgSupply = bigNumberify(0);

  for (let i = 0; i < tokenList.length; i++) {
    const token = tokenList[i];
    const tokenInfo = infoTokens[token.address];
    if (tokenInfo && tokenInfo.usdgAmount) {
      adjustedUsdgSupply = adjustedUsdgSupply.add(tokenInfo.usdgAmount);
    }
  }

  const getWeightText = (tokenInfo) => {
    if (
      !tokenInfo.weight ||
      !tokenInfo.usdgAmount ||
      !adjustedUsdgSupply ||
      adjustedUsdgSupply.eq(0) ||
      !totalTokenWeights
    ) {
      return "...";
    }

    const currentWeightBps = tokenInfo.usdgAmount.mul(BASIS_POINTS_DIVISOR).div(adjustedUsdgSupply);
    // use add(1).div(10).mul(10) to round numbers up
    const targetWeightBps = tokenInfo.weight.mul(BASIS_POINTS_DIVISOR).div(totalTokenWeights).add(1).div(10).mul(10);

    const weightText = `${formatAmount(currentWeightBps, 2, 2, false)}% / ${formatAmount(
      targetWeightBps,
      2,
      2,
      false
    )}%`;

    return (
      <TooltipComponent
        handle={weightText}
        position="right-bottom"
        renderContent={() => {
          return (
            <>
              <StatsTooltipRow
                label={t`Current Weight`}
                value={`${formatAmount(currentWeightBps, 2, 2, false)}%`}
                showDollar={false}
              />
              <StatsTooltipRow
                label={t`Target Weight`}
                value={`${formatAmount(targetWeightBps, 2, 2, false)}%`}
                showDollar={false}
              />
              <br />
              {currentWeightBps.lt(targetWeightBps) && (
                <div className="text-white">
                  <Trans>
                    {tokenInfo.symbol} is below its target weight.
                    <br />
                    <br />
                    Get lower fees to{" "}
                    <Link to="/liquidity" target="_blank" rel="noopener noreferrer">
                      buy LLP
                    </Link>{" "}
                    with {tokenInfo.symbol},&nbsp; and to{" "}
                    <Link to="/trade" target="_blank" rel="noopener noreferrer">
                      swap
                    </Link>{" "}
                    {tokenInfo.symbol} for other tokens.
                  </Trans>
                </div>
              )}
              {currentWeightBps.gt(targetWeightBps) && (
                <div className="text-white">
                  <Trans>
                    {tokenInfo.symbol} is above its target weight.
                    <br />
                    <br />
                    Get lower fees to{" "}
                    <Link to="/trade" target="_blank" rel="noopener noreferrer">
                      swap
                    </Link>{" "}
                    tokens for {tokenInfo.symbol}.
                  </Trans>
                </div>
              )}
              <br />
              <div>
                <ExternalLink href="docs.axion.finance/llp">
                  <Trans>More Info</Trans>
                </ExternalLink>
              </div>
            </>
          );
        }}
      />
    );
  };

  // let stakedPercent = 0;

  // if (totalLiqSupply && !totalLiqSupply.isZero() && !totalStakedLiq.isZero()) {
  //   stakedPercent = totalStakedLiq.mul(100).div(totalLiqSupply).toNumber();
  // }

  // let liquidityPercent = 0;

  // if (totalLiqSupply && !totalLiqSupply.isZero() && totalLiqInLiquidity) {
  //   liquidityPercent = totalLiqInLiquidity.mul(100).div(totalLiqSupply).toNumber();
  // }

  //let notStakedPercent = 100 - stakedPercent - liquidityPercent;

  // let liqDistributionData = [
  //   {
  //     name: t`staked`,
  //     value: stakedPercent,
  //     color: "#4353fa",
  //   },
  //   {
  //     name: t`in liquidity`,
  //     value: liquidityPercent,
  //     color: "#0598fa",
  //   },
  //   {
  //     name: t`not staked`,
  //     value: notStakedPercent,
  //     color: "#5c0af5",
  //   },
  // ];

  const totalStatsStartDate = chainId === TAIKO_MAINNET ? t`06 Sep 2023` : t`10 Sep 2023`;

  let stableGlp = 0;
  let totalGlp = 0;

  let glpPool = tokenList.map((token) => {
    const tokenInfo = infoTokens[token.address];
    if (tokenInfo.usdgAmount && adjustedUsdgSupply && adjustedUsdgSupply.gt(0)) {
      const currentWeightBps = tokenInfo.usdgAmount.mul(BASIS_POINTS_DIVISOR).div(adjustedUsdgSupply);
      if (tokenInfo.isStable) {
        stableGlp += parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`);
      }
      totalGlp += parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`);
      return {
        fullname: token.name,
        name: token.symbol,
        value: parseFloat(`${formatAmount(currentWeightBps, 2, 2, false)}`),
      };
    }
    return null;
  });

  let stablePercentage = totalGlp > 0 ? ((stableGlp * 100) / totalGlp).toFixed(2) : "0.0";

  glpPool = glpPool.filter(function (element) {
    return element !== null;
  });

  glpPool = glpPool.sort(function (a, b) {
    if (a.value < b.value) return 1;
    else return -1;
  });

  // liqDistributionData = liqDistributionData.sort(function (a, b) {
  //   if (a.value < b.value) return 1;
  //   else return -1;
  // });

  // const [liqActiveIndex, setLIQActiveIndex] = useState(null);

  // const onLIQDistributionChartEnter = (_, index) => {
  //   setLIQActiveIndex(index);
  // };

  // const onLIQDistributionChartLeave = (_, index) => {
  //   setLIQActiveIndex(null);
  // };

  const [glpActiveIndex, setGLPActiveIndex] = useState(null);

  const onGLPPoolChartEnter = (_, index) => {
    setGLPActiveIndex(index);
  };

  const onGLPPoolChartLeave = (_, index) => {
    setGLPActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="stats-label">
          <div className="stats-label-color" style={{ backgroundColor: payload[0].color }}></div>
          {payload[0].value}% {payload[0].name}
        </div>
      );
    }

    return null;
  };

  return (
    <SEO title={getPageTitle("Dashboard")}>
      <div className="default-container DashboardV2 page-layout">
        <div className="section-title-block">
          <div className="section-title-icon"></div>
          <div className="section-title-content">
            <div className="Page-title">
              <Trans>Stats</Trans>{" "}
              {chainId === AVALANCHE && <img src={avalanche24Icon} alt="avalanche24Icon" style={{ height: "24px" }} />}
              {chainId === TAIKO_MAINNET && <img src={ftm24Icon} alt="ftm24Icon" style={{ height: "24px" }} />}
            </div>
            <div className="Page-description">
              <Trans>
                {chainName} Total Stats start from {totalStatsStartDate}.<br /> For detailed stats:
              </Trans>{" "}
              {chainId === TAIKO_MAINNET && (
                <ExternalLink href="https://stats.axion.finance">https://stats.axion.finance</ExternalLink>
              )}
              .
            </div>
          </div>
        </div>
        <div className="DashboardV2-content">
          <div className="DashboardV2-cards">
            <div className="App-card">
              <div className="App-card-title">
                <Trans>Overview</Trans>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-content">
                <div className="App-card-row">
                  <div className="label">
                    <Trans>AUM</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      handle={`$${formatAmount(tvl, USD_DECIMALS, 0, true)}`}
                      position="right-bottom"
                      renderContent={() => <span>{`Assets Under Management: LLP pool (${chainName})`}</span>}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>LLP Pool</Trans>
                  </div>
                  <div>
                    <TooltipComponent
                      handle={`$${formatAmount(aum, USD_DECIMALS, 0, true)}`}
                      position="right-bottom"
                      renderContent={() => <span>{t`Total value of tokens in LLP pool (${chainName})`}</span>}
                    />
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>24h Volume</Trans>
                  </div>
                  <div>
                    {`$${formatAmount(dataStats?.[0].volume24h, USD_DECIMALS, 0, true)}`}
                    {/* <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={`$${formatAmount(currentVolumeInfo?.[chainId]?.totalVolume, USD_DECIMALS, 0, true)}`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Volume`}
                          arbitrumValue={currentVolumeInfo?.[ARBITRUM].totalVolume}
                          avaxValue={currentVolumeInfo?.[AVALANCHE].totalVolume}
                          total={currentVolumeInfo?.totalVolume}
                        />
                      )}
                    /> */}
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Long Positions</Trans>
                  </div>
                  <div>
                    {`$${formatAmount(dataStats?.[0].longOpenInterest, USD_DECIMALS, 0, true)}`}
                    {/* <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={`$${formatAmount(
                        positionStatsInfo?.[chainId]?.totalLongPositionSizes,
                        USD_DECIMALS,
                        0,
                        true
                      )}`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Long Positions`}
                          arbitrumValue={positionStatsInfo?.[ARBITRUM].totalLongPositionSizes}
                          avaxValue={positionStatsInfo?.[AVALANCHE].totalLongPositionSizes}
                          total={positionStatsInfo?.totalLongPositionSizes}
                        />
                      )}
                    /> */}
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Short Positions</Trans>
                  </div>
                  <div>
                    {`$${formatAmount(dataStats?.[0].shortOpenInterest, USD_DECIMALS, 0, true)}`}
                    {/* <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={`$${formatAmount(
                        positionStatsInfo?.[chainId]?.totalShortPositionSizes,
                        USD_DECIMALS,
                        0,
                        true
                      )}`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Short Positions`}
                          arbitrumValue={positionStatsInfo?.[ARBITRUM].totalShortPositionSizes}
                          avaxValue={positionStatsInfo?.[AVALANCHE].totalShortPositionSizes}
                          total={positionStatsInfo?.totalShortPositionSizes}
                        />
                      )}
                    /> */}
                  </div>
                </div>
                {/* {feesSummary.lastUpdatedAt ? (
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Fees since</Trans> {formatDate(feesSummary.lastUpdatedAt)}
                    </div>
                    <div>
                    {`$${formatAmount(currentFees?.[chainId], USD_DECIMALS, 2, true)}`}
                      
                    </div>
                  </div>
                ) : null} */}
              </div>
            </div>
            <div className="App-card">
              <div className="App-card-title">
                <Trans>Total Stats</Trans>
              </div>
              <div className="App-card-divider"></div>
              <div className="App-card-content">
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Total Fees</Trans>
                  </div>
                  <div>
                    {`$${formatAmount(dataStats?.[0].totalFees, USD_DECIMALS, 0, true)}`}
                    {/* <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={`$${numberWithCommas(totalFees?.[chainId])}`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Total Fees`}
                          arbitrumValue={totalFees?.[ARBITRUM]}
                          avaxValue={totalFees?.[AVALANCHE]}
                          total={totalFees?.total}
                          decimalsForConversion={0}
                        />
                      )}
                    /> */}
                  </div>
                </div>
                <div className="App-card-row">
                  <div className="label">
                    <Trans>Total Volume</Trans>
                  </div>
                  <div>
                    {`$${formatAmount(dataStats?.[0].totalVolume, USD_DECIMALS, 0, true)}`}
                    {/* <TooltipComponent
                      position="right-bottom"
                      className="nowrap"
                      handle={`$${formatAmount(totalVolume?.[chainId], USD_DECIMALS, 0, true)}`}
                      renderContent={() => (
                        <StatsTooltip
                          title={t`Total Volume`}
                          arbitrumValue={totalVolume?.[ARBITRUM]}
                          avaxValue={totalVolume?.[AVALANCHE]}
                          total={totalVolume?.total}
                        />
                      )}
                    /> */}
                  </div>
                </div>
                {/* <div className="App-card-row">
                  <div className="label">
                    <Trans>Floor Price Fund</Trans>
                  </div>
                  <div>${formatAmount(totalFloorPriceFundUsd, 30, 0, true)}</div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="Tab-title-section">
            <div className="Page-title">
              <Trans>Tokens</Trans>{" "}
              {chainId === AVALANCHE && <img src={avalanche24Icon} alt="avalanche24Icon" style={{ height: "24px" }} />}
              {chainId === ARBITRUM && <img src={arbitrum24Icon} alt="arbitrum24Icon" style={{ height: "24px" }} />}
              {chainId === TAIKO_MAINNET && <img src={ftm24Icon} alt="ftm24Icon" style={{ height: "24px" }} />}
            </div>
            <div className="Page-description">
              <Trans>Platform and LLP index tokens.</Trans>
            </div>
          </div>
          <div className="DashboardV2-token-cards">
            <div className="stats-wrapper">
              <div className="App-card">
                <div className="stats-block">
                  <div className="App-card-title">
                    <div className="App-card-title-mark">
                      <div className="App-card-title-mark-icon">
                        <img src={llp40Icon} alt="LLP Icon" />
                        {chainId === ARBITRUM ? (
                          <img src={arbitrum16Icon} alt={t`Arbitrum Icon`} className="selected-network-symbol" />
                        ) : (
                          <img src={taikoIcon} alt={t`Taiko Icon`} className="selected-network-symbol" />
                        )}
                      </div>
                      <div className="App-card-title-mark-info">
                        <div className="App-card-title-mark-title">LLP</div>
                        <div className="App-card-title-mark-subtitle">LLP</div>
                      </div>
                      <div>
                        <AssetDropdown assetSymbol="LLP" />
                      </div>
                    </div>
                  </div>
                  <div className="App-card-divider"></div>
                  <div className="App-card-content">
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Price</Trans>
                      </div>
                      <div>${formatAmount(glpPrice, USD_DECIMALS, 3, true)}</div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Supply</Trans>
                      </div>
                      <div>{formatAmount(glpSupply, GLP_DECIMALS, 0, true)} LLP</div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Total Staked</Trans>
                      </div>
                      <div>${formatAmount(glpMarketCap, USD_DECIMALS, 0, true)}</div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Market Cap</Trans>
                      </div>
                      <div>${formatAmount(glpMarketCap, USD_DECIMALS, 0, true)}</div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Stablecoin Percentage</Trans>
                      </div>
                      <div>{stablePercentage}%</div>
                    </div>
                  </div>
                </div>
                <div className="stats-piechart" onMouseOut={onGLPPoolChartLeave}>
                  {glpPool.length > 0 && (
                    <PieChart width={210} height={210}>
                      <Pie
                        data={glpPool}
                        cx={100}
                        cy={100}
                        innerRadius={73}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        onMouseEnter={onGLPPoolChartEnter}
                        onMouseOut={onGLPPoolChartLeave}
                        onMouseLeave={onGLPPoolChartLeave}
                        paddingAngle={2}
                      >
                        {glpPool.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={GLP_POOL_COLORS[entry.name]}
                            style={{
                              filter:
                                glpActiveIndex === index
                                  ? `drop-shadow(0px 0px 6px ${hexToRgba(GLP_POOL_COLORS[entry.name], 0.7)})`
                                  : "none",
                              cursor: "pointer",
                            }}
                            stroke={GLP_POOL_COLORS[entry.name]}
                            strokeWidth={glpActiveIndex === index ? 1 : 1}
                          />
                        ))}
                      </Pie>
                      <text x={"50%"} y={"50%"} fill="white" textAnchor="middle" dominantBaseline="middle">
                        LLP Pool
                      </text>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  )}
                </div>
              </div>
            </div>
            <div className="token-table-wrapper App-card">
              <div className="App-card-title">
                <Trans>LLP Index Composition</Trans>{" "}
                {chainId === AVALANCHE && (
                  <img src={avalanche16Icon} alt={t`Avalanche Icon`} style={{ height: "24px" }} />
                )}
                {chainId === ARBITRUM && <img src={arbitrum16Icon} alt={t`Arbitrum Icon`} style={{ height: "24px" }} />}
                {chainId === TAIKO_MAINNET && <img src={taikoIcon} alt={t`Taiko Icon`} style={{ height: "24px" }} />}
              </div>
              <div className="App-card-divider"></div>
              <table className="token-table">
                <thead>
                  <tr>
                    <th>
                      <Trans>TOKEN</Trans>
                    </th>
                    <th>
                      <Trans>PRICE</Trans>
                    </th>
                    <th>
                      <Trans>POOL</Trans>
                    </th>
                    <th>
                      <Trans>WEIGHT</Trans>
                    </th>
                    <th>
                      <Trans>UTILIZATION</Trans>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTokens.map((token) => {
                    const tokenInfo = infoTokens[token.address];
                    let utilization = bigNumberify(0);
                    if (tokenInfo && tokenInfo.reservedAmount && tokenInfo.poolAmount && tokenInfo.poolAmount.gt(0)) {
                      utilization = tokenInfo.reservedAmount.mul(BASIS_POINTS_DIVISOR).div(tokenInfo.poolAmount);
                    }
                    let maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
                    if (tokenInfo.maxUsdgAmount && tokenInfo.maxUsdgAmount.gt(0)) {
                      maxUsdgAmount = tokenInfo.maxUsdgAmount;
                    }
                    const tokenImage = importImage("ic_" + token.symbol.toLowerCase() + "_40.svg");

                    return (
                      <tr key={token.symbol}>
                        <td>
                          <div className="token-symbol-wrapper">
                            <div className="App-card-title-info">
                              <div className="App-card-title-info-icon">
                                <img src={tokenImage} alt={token.symbol} width="40px" />
                              </div>
                              <div className="App-card-title-info-text">
                                <div className="App-card-info-title">{token.name}</div>
                                <div className="App-card-info-subtitle">{token.symbol}</div>
                              </div>
                              <div>
                                <AssetDropdown assetSymbol={token.symbol} assetInfo={token} />
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          ${formatKeyAmount(tokenInfo, "minPrice", USD_DECIMALS, tokenInfo?.displayDecimals || 2, true)}
                        </td>
                        <td>
                          <TooltipComponent
                            handle={`$${formatKeyAmount(tokenInfo, "managedUsd", USD_DECIMALS, 0, true)}`}
                            position="right-bottom"
                            renderContent={() => {
                              return (
                                <>
                                  <StatsTooltipRow
                                    label={t`Pool Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "managedAmount", token.decimals, 4, true)} ${
                                      token.symbol
                                    }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Target Min Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "bufferAmount", token.decimals, 4, true)} ${
                                      token.symbol
                                    }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Max ${tokenInfo.symbol} Capacity`}
                                    value={formatAmount(maxUsdgAmount, 18, 0, true)}
                                    showDollar={true}
                                  />
                                </>
                              );
                            }}
                          />
                        </td>
                        <td>{getWeightText(tokenInfo)}</td>
                        <td>{formatAmount(utilization, 2, 2, false)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="token-grid">
              {visibleTokens.map((token) => {
                const tokenInfo = infoTokens[token.address];
                let utilization = bigNumberify(0);
                if (tokenInfo && tokenInfo.reservedAmount && tokenInfo.poolAmount && tokenInfo.poolAmount.gt(0)) {
                  utilization = tokenInfo.reservedAmount.mul(BASIS_POINTS_DIVISOR).div(tokenInfo.poolAmount);
                }
                let maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
                if (tokenInfo.maxUsdgAmount && tokenInfo.maxUsdgAmount.gt(0)) {
                  maxUsdgAmount = tokenInfo.maxUsdgAmount;
                }

                const tokenImage = importImage("ic_" + token.symbol.toLowerCase() + "_24.svg");
                return (
                  <div className="App-card" key={token.symbol}>
                    <div className="App-card-title">
                      <div className="mobile-token-card">
                        <img src={tokenImage} alt={token.symbol} width="20px" />
                        <div className="token-symbol-text">{token.symbol}</div>
                        <div>
                          <AssetDropdown assetSymbol={token.symbol} assetInfo={token} />
                        </div>
                      </div>
                    </div>
                    <div className="App-card-divider"></div>
                    <div className="App-card-content">
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Price</Trans>
                        </div>
                        <div>
                          ${formatKeyAmount(tokenInfo, "minPrice", USD_DECIMALS, tokenInfo?.displayDecimals || 2, true)}
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Pool</Trans>
                        </div>
                        <div>
                          <TooltipComponent
                            handle={`$${formatKeyAmount(tokenInfo, "managedUsd", USD_DECIMALS, 0, true)}`}
                            position="right-bottom"
                            renderContent={() => {
                              return (
                                <>
                                  <StatsTooltipRow
                                    label={t`Pool Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "managedAmount", token.decimals, 0, true)} ${
                                      token.symbol
                                    }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Target Min Amount`}
                                    value={`${formatKeyAmount(tokenInfo, "bufferAmount", token.decimals, 0, true)} ${
                                      token.symbol
                                    }`}
                                    showDollar={false}
                                  />
                                  <StatsTooltipRow
                                    label={t`Max ${tokenInfo.symbol} Capacity`}
                                    value={formatAmount(maxUsdgAmount, 18, 0, true)}
                                  />
                                </>
                              );
                            }}
                          />
                        </div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Weight</Trans>
                        </div>
                        <div>{getWeightText(tokenInfo)}</div>
                      </div>
                      <div className="App-card-row">
                        <div className="label">
                          <Trans>Utilization</Trans>
                        </div>
                        <div>{formatAmount(utilization, 2, 2, false)}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SEO>
  );
}
