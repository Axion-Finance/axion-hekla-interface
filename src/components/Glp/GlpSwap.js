import { Trans, t } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import cx from "classnames";
import { getContract } from "config/contracts";
import { ethers } from "ethers";
import {
  BASIS_POINTS_DIVISOR,
  GLP_COOLDOWN_DURATION,
  GLP_DECIMALS,
  PLACEHOLDER_ACCOUNT,
  USDG_DECIMALS,
  USD_DECIMALS,
  adjustForDecimals,
  getBuyGlpFromAmount,
  getBuyGlpToAmount,
  getSellGlpFromAmount,
  getSellGlpToAmount,
  importImage,
} from "lib/legacy";
import { useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import useSWR from "swr";
import Tab from "../Tab/Tab";

import { useLiqPrice } from "domain/legacy";

import BuyInputSection from "../BuyInputSection/BuyInputSection";
import TokenSelector from "../Exchange/TokenSelector";
import Tooltip from "../Tooltip/Tooltip";

import LlpManager from "abis/LlpManager.json";
import ReaderV2 from "abis/ReaderV2.json";
import RewardReader from "abis/RewardReader.json";
import RewardTracker from "abis/RewardTracker.json";
import VaultV2 from "abis/VaultV2.json";
// import Vester from "abis/Vester.json";
import RewardRouter from "abis/RewardRouter.json";
import Token from "abis/Token.json";

import arrowIcon from "img/ic_convert_down.svg";
import glp24Icon from "img/ic_llp_24.svg";
import llp40Icon from "img/ic_llp_40.svg";

//import avalanche16Icon from "img/ic_avalanche_16.svg";
import fantom16Icon from "img/167000.png";

import arbitrum16Icon from "img/167000.png";

import ExternalLink from "components/ExternalLink/ExternalLink";
import { ARBITRUM, IS_NETWORK_DISABLED, TAIKO_MAINNET, getChainName } from "config/chains";
import { getNativeToken, getToken, getTokens, getWhitelistedTokens, getWrappedToken } from "config/tokens";
import { approveTokens, useInfoTokens } from "domain/tokens";
import { getTokenInfo, getUsd } from "domain/tokens/utils";
import { useChainId } from "lib/chains";
import { callContract, contractFetcher } from "lib/contracts";
import { helperToast } from "lib/helperToast";
import { useLocalStorageByChainId } from "lib/localStorage";
import { bigNumberify, expandDecimals, formatAmount, formatAmountFree, formatKeyAmount, parseValue } from "lib/numbers";
import AssetDropdown from "pages/Dashboard/AssetDropdown";
import StakeV2 from "pages/Stake/StakeV2";
import StatsTooltipRow from "../StatsTooltip/StatsTooltipRow";
import "./GlpSwap.css";
import SwapErrorModal from "./SwapErrorModal";

const { AddressZero } = ethers.constants;

function getStakingData(stakingInfo) {
  if (!stakingInfo || stakingInfo.length === 0) {
    return;
  }

  const keys = [/*"stakedGlpTracker",*/ "feeGlpTracker"];
  const data = {};
  const propsLength = 5;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    data[key] = {
      claimable: stakingInfo[i * propsLength],
      tokensPerInterval: stakingInfo[i * propsLength + 1],
      averageStakedAmounts: stakingInfo[i * propsLength + 2],
      cumulativeRewards: stakingInfo[i * propsLength + 3],
      totalSupply: stakingInfo[i * propsLength + 4],
    };
  }

  return data;
}

function getTooltipContent(managedUsd, tokenInfo, token) {
  return (
    <>
      <StatsTooltipRow
        label={t`Current Pool Amount`}
        value={[
          `$${formatAmount(managedUsd, USD_DECIMALS, 0, true)}`,
          `(${formatKeyAmount(tokenInfo, "managedAmount", token.decimals, 0, true)} ${token.symbol})`,
        ]}
      />
      <StatsTooltipRow label={t`Max Pool Capacity`} value={formatAmount(tokenInfo.maxUsdgAmount, 18, 0, true)} />
    </>
  );
}

export default function GlpSwap(props) {
  const {
    savedSlippageAmount,
    isBuying,
    setPendingTxns,
    connectWallet,
    setIsBuying,
    savedShouldDisableValidationForTesting,
  } = props;
  const history = useHistory();
  const swapLabel = isBuying ? "BuyGlp" : "SellGlp";
  const tabLabel = isBuying ? t`Buy LLP` : t`Sell LLP`;
  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();
  // const chainName = getChainName(chainId)
  const tokens = getTokens(chainId);
  const whitelistedTokens = getWhitelistedTokens(chainId);
  const tokenList = whitelistedTokens.filter((t) => !t.isWrapped);
  const visibleTokens = tokenList.filter((t) => !t.isTempHidden);
  const [swapValue, setSwapValue] = useState("");
  const [glpValue, setGlpValue] = useState("");
  const [swapTokenAddress, setSwapTokenAddress] = useLocalStorageByChainId(
    chainId,
    `${swapLabel}-swap-token-address`,
    AddressZero
  );
  const [isApproving, setIsApproving] = useState(false);
  const [isWaitingForApproval, setIsWaitingForApproval] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorOnSwapAmount, setAnchorOnSwapAmount] = useState(true);
  const [feeBasisPoints, setFeeBasisPoints] = useState("");
  const [modalError, setModalError] = useState(false);

  const readerAddress = getContract(chainId, "Reader");
  const rewardReaderAddress = getContract(chainId, "RewardReader");
  const vaultAddress = getContract(chainId, "Vault");
  const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");
  //const stakedGlpTrackerAddress = getContract(chainId, "StakedLlpTracker");
  const feeGlpTrackerAddress = getContract(chainId, "FeeLlpTracker");
  const usdfAddress = getContract(chainId, "USDG");
  const llpAddress = getContract(chainId, "LLP");
  const glpManagerAddress = getContract(chainId, "LlpManager");
  const rewardRouterAddress = getContract(chainId, "RewardRouter");

  const tokensForBalanceAndSupplyQuery = [llpAddress, usdfAddress];

  const tokenAddresses = tokens.map((token) => token.address);
  const { data: tokenBalances } = useSWR(
    [`GlpSwap:getTokenBalances:${active}`, chainId, readerAddress, "getTokenBalances", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(library, ReaderV2, [tokenAddresses]),
    }
  );
  // console.log("tokenBalancesdata", tokenBalances);
  const { data: balancesAndSupplies } = useSWR(
    [
      `GlpSwap:getTokenBalancesWithSupplies:${active}`,
      chainId,
      readerAddress,
      "getTokenBalancesWithSupplies",
      account || PLACEHOLDER_ACCOUNT,
    ],
    {
      fetcher: contractFetcher(library, ReaderV2, [tokensForBalanceAndSupplyQuery]),
    }
  );

  const { data: aums } = useSWR([`GlpSwap:getAums:${active}`, chainId, glpManagerAddress, "getAums"], {
    fetcher: contractFetcher(library, LlpManager),
  });

  const { data: totalTokenWeights } = useSWR(
    [`GlpSwap:totalTokenWeights:${active}`, chainId, vaultAddress, "totalTokenWeights"],
    {
      fetcher: contractFetcher(library, VaultV2),
    }
  );

  const tokenAllowanceAddress = swapTokenAddress === AddressZero ? nativeTokenAddress : swapTokenAddress;
  const { data: tokenAllowance } = useSWR(
    [active, chainId, tokenAllowanceAddress, "allowance", account || PLACEHOLDER_ACCOUNT, glpManagerAddress],
    {
      fetcher: contractFetcher(library, Token),
    }
  );

  const { data: lastPurchaseTime } = useSWR(
    [`GlpSwap:lastPurchaseTime:${active}`, chainId, glpManagerAddress, "lastAddedAt", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(library, LlpManager),
    }
  );

  const { data: glpBalance } = useSWR(
    [`GlpSwap:glpBalance:${active}`, chainId, feeGlpTrackerAddress, "stakedAmounts", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(library, RewardTracker),
    }
  );

  // const glpVesterAddress = getContract(chainId, "LlpVester");
  // const { data: reservedAmount } = useSWR(
  //   [`GlpSwap:reservedAmount:${active}`, chainId, glpVesterAddress, "pairAmounts", account || PLACEHOLDER_ACCOUNT],
  //   {
  //     fetcher: contractFetcher(library, Vester),
  //   }
  // );

  const { axionPrice } = useLiqPrice(chainId, { arbitrum: chainId === TAIKO_MAINNET ? library : undefined }, active);

  const rewardTrackersForStakingInfo = [/*stakedGlpTrackerAddress, */ feeGlpTrackerAddress];
  const { data: stakingInfo } = useSWR(
    [`GlpSwap:stakingInfo:${active}`, chainId, rewardReaderAddress, "getStakingInfo", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(library, RewardReader, [rewardTrackersForStakingInfo]),
    }
  );
  console.log("Glpswap_stakingInfo", stakingInfo);
  const stakingData = getStakingData(stakingInfo);

  const redemptionTime = lastPurchaseTime ? lastPurchaseTime.add(GLP_COOLDOWN_DURATION) : undefined;
  const inCooldownWindow = redemptionTime && parseInt(Date.now() / 1000) < redemptionTime;

  const glpSupply = balancesAndSupplies ? balancesAndSupplies[1] : bigNumberify(0);
  const usdgSupply = balancesAndSupplies ? balancesAndSupplies[3] : bigNumberify(0);
  let aum;
  if (aums && aums.length > 0) {
    aum = isBuying ? aums[0] : aums[1];
  }
  const glpPrice =
    aum && aum.gt(0) && glpSupply.gt(0)
      ? aum.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupply)
      : expandDecimals(1, USD_DECIMALS);

  console.log("glpPrice", glpPrice.toString());
  let glpBalanceUsd;
  if (glpBalance) {
    glpBalanceUsd = glpBalance.mul(glpPrice).div(expandDecimals(1, GLP_DECIMALS));
  }
  const glpSupplyUsd = glpSupply.mul(glpPrice).div(expandDecimals(1, GLP_DECIMALS));

  // let reserveAmountUsd;
  // if (reservedAmount) {
  //   reserveAmountUsd = reservedAmount.mul(glpPrice).div(expandDecimals(1, GLP_DECIMALS));
  // }

  let maxSellAmount = glpBalance;
  // if (glpBalance && reservedAmount) {
  //   maxSellAmount = glpBalance.sub(reservedAmount);
  // }

  const { infoTokens } = useInfoTokens(library, chainId, active, tokenBalances, undefined);
  const swapToken = getToken(chainId, swapTokenAddress);
  const swapTokenInfo = getTokenInfo(infoTokens, swapTokenAddress);

  const swapTokenBalance = swapTokenInfo && swapTokenInfo.balance ? swapTokenInfo.balance : bigNumberify(0);

  const swapAmount = parseValue(swapValue, swapToken && swapToken.decimals);
  const glpAmount = parseValue(glpValue, GLP_DECIMALS);

  const needApproval =
    isBuying && swapTokenAddress !== AddressZero && tokenAllowance && swapAmount && swapAmount.gt(tokenAllowance);

  const swapUsdMin = getUsd(swapAmount, swapTokenAddress, false, infoTokens);
  const glpUsdMax = glpAmount && glpPrice ? glpAmount.mul(glpPrice).div(expandDecimals(1, GLP_DECIMALS)) : undefined;

  let isSwapTokenCapReached;
  if (swapTokenInfo.managedUsd && swapTokenInfo.maxUsdgAmount) {
    isSwapTokenCapReached = swapTokenInfo.managedUsd.gt(
      adjustForDecimals(swapTokenInfo.maxUsdgAmount, USDG_DECIMALS, USD_DECIMALS)
    );
  }

  const onSwapValueChange = (e) => {
    setAnchorOnSwapAmount(true);
    setSwapValue(e.target.value);
  };

  const onGlpValueChange = (e) => {
    setAnchorOnSwapAmount(false);
    setGlpValue(e.target.value);
  };

  const onSelectSwapToken = (token) => {
    setSwapTokenAddress(token.address);
    setIsWaitingForApproval(false);
  };

  // const nativeToken = getTokenInfo(infoTokens, AddressZero);

  let totalApr = useRef(bigNumberify(0));
  let totalRewardsInUsd = useRef(bigNumberify(0));

  const { data: claimableAll } = useSWR(
    [`Stake:claimableAll:${active}`, chainId, feeGlpTrackerAddress, "claimableAll", account || PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(library, RewardTracker, []),
    }
  );

  // // console.log("claimableAll", claimableAll);

  const rewardTokens = useMemo(() => {
    if (!Array.isArray(claimableAll) || claimableAll.length !== 2) return [];
    const [claimableTokens, claimableRewards] = claimableAll;
    const result = [];
    for (let i = 0; i < claimableTokens.length; i++) {
      const reward = claimableRewards[i];
      if (claimableTokens[i] === getContract(chainId, "AXION")) {
        const rewardInUsd = axionPrice.mul(reward).div(expandDecimals(1, 18));
        totalRewardsInUsd.current = totalRewardsInUsd.current.add(rewardInUsd);
        totalApr.current = totalRewardsInUsd.current.mul;
        result.push({
          token: { address: claimableTokens[i], symbol: "AXION", rewardDisplayDecimals: 2 },
          reward,
          rewardInUsd,
        });
      } else {
        const token = infoTokens[claimableTokens[i]];
        if (token) {
          const rewardInUsd = token.maxPrice && token.maxPrice.mul(reward).div(expandDecimals(1, token.decimals));
          result.push({ token, reward, rewardInUsd });
        }
      }
    }
    return result;
  }, [claimableAll, chainId, axionPrice, infoTokens]);

  useEffect(() => {
    const updateSwapAmounts = () => {
      if (anchorOnSwapAmount) {
        if (!swapAmount) {
          setGlpValue("");
          setFeeBasisPoints("");
          return;
        }

        if (isBuying) {
          const { amount: nextAmount, feeBasisPoints: feeBps } = getBuyGlpToAmount(
            swapAmount,
            swapTokenAddress,
            infoTokens,
            glpPrice,
            usdgSupply,
            totalTokenWeights
          );
          const nextValue = formatAmountFree(nextAmount, GLP_DECIMALS, GLP_DECIMALS);
          // console.log("nextAmount", nextAmount.toString());
          // console.log("nextValue", nextValue);
          // console.log("feeBps", feeBps);
          // console.log("glpPrice", glpPrice.toString());
          // console.log("usdgSupply", usdgSupply.toString());
          // console.log("totalTokenWeights", totalTokenWeights.toString());
          setGlpValue(nextValue);
          setFeeBasisPoints(feeBps);
        } else {
          const { amount: nextAmount, feeBasisPoints: feeBps } = getSellGlpFromAmount(
            swapAmount,
            swapTokenAddress,
            infoTokens,
            glpPrice,
            usdgSupply,
            totalTokenWeights
          );
          const nextValue = formatAmountFree(nextAmount, GLP_DECIMALS, GLP_DECIMALS);
          setGlpValue(nextValue);
          setFeeBasisPoints(feeBps);
        }

        return;
      }

      if (!glpAmount) {
        setSwapValue("");
        setFeeBasisPoints("");
        return;
      }

      if (swapToken) {
        if (isBuying) {
          const { amount: nextAmount, feeBasisPoints: feeBps } = getBuyGlpFromAmount(
            glpAmount,
            swapTokenAddress,
            infoTokens,
            glpPrice,
            usdgSupply,
            totalTokenWeights
          );
          const nextValue = formatAmountFree(nextAmount, swapToken.decimals, swapToken.decimals);
          setSwapValue(nextValue);
          setFeeBasisPoints(feeBps);
        } else {
          const { amount: nextAmount, feeBasisPoints: feeBps } = getSellGlpToAmount(
            glpAmount,
            swapTokenAddress,
            infoTokens,
            glpPrice,
            usdgSupply,
            totalTokenWeights,
            true
          );

          const nextValue = formatAmountFree(nextAmount, swapToken.decimals, swapToken.decimals);
          setSwapValue(nextValue);
          setFeeBasisPoints(feeBps);
        }
      }
    };

    updateSwapAmounts();
  }, [
    isBuying,
    anchorOnSwapAmount,
    swapAmount,
    glpAmount,
    swapToken,
    swapTokenAddress,
    infoTokens,
    glpPrice,
    usdgSupply,
    totalTokenWeights,
  ]);

  const switchSwapOption = (hash = "") => {
    history.push(`${history.location.pathname}#${hash}`);
    props.setIsBuying(hash === "redeem" ? false : true);
  };

  const fillMaxAmount = () => {
    if (isBuying) {
      setAnchorOnSwapAmount(true);
      setSwapValue(formatAmountFree(swapTokenBalance, swapToken.decimals, swapToken.decimals));
      return;
    }

    setAnchorOnSwapAmount(false);
    setGlpValue(formatAmountFree(maxSellAmount, GLP_DECIMALS, GLP_DECIMALS));
  };

  const getError = () => {
    if (IS_NETWORK_DISABLED[chainId]) {
      if (isBuying) return [t`LLP buy disabled, pending ${getChainName(chainId)} upgrade`];
      return [t`LLP sell disabled, pending ${getChainName(chainId)} upgrade`];
    }

    if (!isBuying && inCooldownWindow) {
      return [t`Redemption time not yet reached`];
    }

    if (!swapAmount || swapAmount.eq(0)) {
      return [t`Enter an amount`];
    }
    if (!glpAmount || glpAmount.eq(0)) {
      return [t`Enter an amount`];
    }

    if (isBuying) {
      const swapTokenInfo = getTokenInfo(infoTokens, swapTokenAddress);
      if (
        !savedShouldDisableValidationForTesting &&
        swapTokenInfo &&
        swapTokenInfo.balance &&
        swapAmount &&
        swapAmount.gt(swapTokenInfo.balance)
      ) {
        return [t`Insufficient ${swapTokenInfo.symbol} balance`];
      }

      if (swapTokenInfo.maxUsdgAmount && swapTokenInfo.usdgAmount && swapUsdMin) {
        const usdgFromAmount = adjustForDecimals(swapUsdMin, USD_DECIMALS, USDG_DECIMALS);
        const nextUsdgAmount = swapTokenInfo.usdgAmount.add(usdgFromAmount);
        if (swapTokenInfo.maxUsdgAmount.gt(0) && nextUsdgAmount.gt(swapTokenInfo.maxUsdgAmount)) {
          return [t`${swapTokenInfo.symbol} pool exceeded, try different token`, true];
        }
      }
    }

    if (!isBuying) {
      if (maxSellAmount && glpAmount && glpAmount.gt(maxSellAmount)) {
        return [t`Insufficient LLP balance`];
      }

      const swapTokenInfo = getTokenInfo(infoTokens, swapTokenAddress);
      if (
        swapTokenInfo &&
        swapTokenInfo.availableAmount &&
        swapAmount &&
        swapAmount.gt(swapTokenInfo.availableAmount)
      ) {
        return [t`Insufficient liquidity`];
      }
    }

    return [false];
  };

  const isPrimaryEnabled = () => {
    if (IS_NETWORK_DISABLED[chainId]) {
      return false;
    }
    if (!active) {
      return true;
    }
    const [error, modal] = getError();
    if (error && !modal) {
      return false;
    }
    if ((needApproval && isWaitingForApproval) || isApproving) {
      return false;
    }
    if (isApproving) {
      return false;
    }
    if (isSubmitting) {
      return false;
    }
    if (isBuying && isSwapTokenCapReached) {
      return false;
    }

    return true;
  };

  const getPrimaryText = () => {
    if (!active) {
      return t`Connect Wallet`;
    }
    const [error, modal] = getError();
    if (error && !modal) {
      return error;
    }
    if (isBuying && isSwapTokenCapReached) {
      return t`Max Capacity for ${swapToken.symbol} Reached`;
    }

    if (needApproval && isWaitingForApproval) {
      return t`Waiting for Approval`;
    }
    if (isApproving) {
      return t`Approving ${swapToken.symbol}...`;
    }
    if (needApproval) {
      return t`Approve ${swapToken.symbol}`;
    }

    if (isSubmitting) {
      return isBuying ? t`Buying...` : t`Selling...`;
    }

    return isBuying ? t`Buy LLP` : t`Sell LLP`;
  };

  const approveFromToken = () => {
    approveTokens({
      setIsApproving,
      library,
      tokenAddress: swapToken.address,
      spender: glpManagerAddress,
      chainId: chainId,
      onApproveSubmitted: () => {
        setIsWaitingForApproval(true);
      },
      infoTokens,
      getTokenInfo,
    });
  };

  const buyGlp = () => {
    setIsSubmitting(true);

    const minGlp = glpAmount.mul(BASIS_POINTS_DIVISOR - savedSlippageAmount).div(BASIS_POINTS_DIVISOR);

    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, library.getSigner());
    const method = swapTokenAddress === AddressZero ? "mintAndStakeLlpETH" : "mintAndStakeLlp";
    const params = swapTokenAddress === AddressZero ? [0, minGlp] : [swapTokenAddress, swapAmount, 0, minGlp];
    const value = swapTokenAddress === AddressZero ? swapAmount : 0;
    console.log("buyGlp", swapTokenAddress, swapAmount.toString(), minGlp.toString(), value.toString());
    callContract(chainId, contract, method, params, {
      value,
      sentMsg: t`Buy submitted.`,
      failMsg: t`Buy failed. ${swapTokenInfo.symbol} may have moved in price, try again.`,
      successMsg: t`${formatAmount(glpAmount, 18, 4, true)} LLP bought with ${formatAmount(
        swapAmount,
        swapTokenInfo.decimals,
        4,
        true
      )} ${swapTokenInfo.symbol}!`,
      setPendingTxns,
    })
      .then(async () => {})
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const sellGlp = () => {
    setIsSubmitting(true);

    const minOut = swapAmount.mul(BASIS_POINTS_DIVISOR - savedSlippageAmount).div(BASIS_POINTS_DIVISOR);

    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, library.getSigner());
    const method = swapTokenAddress === AddressZero ? "unstakeAndRedeemLlpETH" : "unstakeAndRedeemLlp";
    const params =
      swapTokenAddress === AddressZero ? [glpAmount, minOut, account] : [swapTokenAddress, glpAmount, minOut, account];

    callContract(chainId, contract, method, params, {
      sentMsg: t`Sell submitted!`,
      failMsg: t`Sell failed.`,
      successMsg: t`${formatAmount(glpAmount, 18, 4, true)} LLP sold for ${formatAmount(
        swapAmount,
        swapTokenInfo.decimals,
        4,
        true
      )} ${swapTokenInfo.symbol}!`,
      setPendingTxns,
    })
      .then(async () => {})
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const onClickPrimary = () => {
    if (!active) {
      connectWallet();
      return;
    }

    if (needApproval) {
      approveFromToken();
      return;
    }

    const [, modal] = getError();

    if (modal) {
      setModalError(true);
      return;
    }

    if (isBuying) {
      buyGlp();
    } else {
      sellGlp();
    }
  };

  let payLabel = t`Pay`;
  let receiveLabel = t`Receive`;
  let payBalance = "$0.00";
  let receiveBalance = "$0.00";
  if (isBuying) {
    if (swapUsdMin) {
      payBalance = `$${formatAmount(swapUsdMin, USD_DECIMALS, 2, true)}`;
    }
    if (glpUsdMax) {
      receiveBalance = `$${formatAmount(glpUsdMax, USD_DECIMALS, 2, true)}`;
    }
  } else {
    if (glpUsdMax) {
      payBalance = `$${formatAmount(glpUsdMax, USD_DECIMALS, 2, true)}`;
    }
    if (swapUsdMin) {
      receiveBalance = `$${formatAmount(swapUsdMin, USD_DECIMALS, 2, true)}`;
    }
  }

  const selectToken = (token) => {
    setAnchorOnSwapAmount(false);
    setSwapTokenAddress(token.address);
    helperToast.success(t`${token.symbol} selected in order form`);
  };

  let feePercentageText = formatAmount(feeBasisPoints, 2, 2, true, "-");
  if (feeBasisPoints !== undefined && feeBasisPoints.toString().length > 0) {
    feePercentageText += "%";
  }

  const wrappedTokenSymbol = getWrappedToken(chainId).symbol;
  const nativeTokenSymbol = getNativeToken(chainId).symbol;

  const onSwapOptionChange = (opt) => {
    if (opt === t`Sell LLP`) {
      switchSwapOption("redeem");
    } else {
      switchSwapOption();
    }
  };

  return (
    <div className="GlpSwap">
      <SwapErrorModal
        isVisible={Boolean(modalError)}
        setIsVisible={setModalError}
        swapToken={swapToken}
        chainId={chainId}
        glpAmount={glpAmount}
        usdgSupply={usdgSupply}
        totalTokenWeights={totalTokenWeights}
        glpPrice={glpPrice}
        infoTokens={infoTokens}
        swapUsdMin={swapUsdMin}
      />
      {/* <div className="Page-title-section">
        <div className="Page-title">{isBuying ? "Buy GLP" : "Sell GLP"}</div>
        {isBuying && <div className="Page-description">
          Purchase <a href="docs.axion.finance/llp" target="_blank" rel="noopener noreferrer">GLP tokens</a> to earn {nativeTokenSymbol} fees from swaps and leverage trading.<br/>
          Note that there is a minimum holding time of 15 minutes after a purchase.<br/>
          <div>View <Link to="/earn">staking</Link> page.</div>
        </div>}
        {!isBuying && <div className="Page-description">
          Redeem your GLP tokens for any supported asset.
          {inCooldownWindow && <div>
            GLP tokens can only be redeemed 15 minutes after your most recent purchase.<br/>
            Your last purchase was at {formatDateTime(lastPurchaseTime)}, you can redeem GLP tokens after {formatDateTime(redemptionTime)}.<br/>
          </div>}
          <div>View <Link to="/earn">staking</Link> page.</div>
        </div>}
      </div> */}
      <div className="GlpSwap-content">
        <div className="App-card GlpSwap-stats-card">
          <div className="App-card-title">
            <div className="App-card-title-mark">
              <div className="App-card-title-mark-icon">
                <img src={llp40Icon} alt="llp40Icon" />
                {chainId === ARBITRUM ? (
                  <img src={arbitrum16Icon} alt="arbitrum16Icon" className="selected-network-symbol" />
                ) : (
                  <img src={fantom16Icon} alt="fantom16Icon" className="selected-network-symbol" />
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
          <div className="App-card-divider" />
          <div className="App-card-content">
            <div className="App-card-row">
              <div className="label">
                <Trans>Price</Trans>
              </div>
              <div className="value">${formatAmount(glpPrice, USD_DECIMALS, 3, true)}</div>
            </div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Wallet</Trans>
              </div>
              <div className="value">
                {formatAmount(glpBalance, GLP_DECIMALS, 4, true)} LLP ($
                {formatAmount(glpBalanceUsd, USD_DECIMALS, 2, true)})
              </div>
            </div>
            <div className="App-card-row">
              <div className="label">
                <Trans>Staked</Trans>
              </div>
              <div className="value">
                {formatAmount(glpBalance, GLP_DECIMALS, 4, true)} LLP ($
                {formatAmount(glpBalanceUsd, USD_DECIMALS, 2, true)})
              </div>
            </div>
          </div>
          <div className="App-card-divider" />

          <div className="App-card-content">
            {/* {!isBuying && (
              <div className="App-card-row">
                <div className="label">
                  <Trans>Reserved</Trans>
                </div>
                <div className="value">
                  <Tooltip
                    handle={`${formatAmount(reservedAmount, 18, 4, true)} LLP ($${formatAmount(
                      reserveAmountUsd,
                      USD_DECIMALS,
                      2,
                      true
                    )})`}
                    position="right-bottom"
                    renderContent={() =>
                      t`${formatAmount(reservedAmount, 18, 4, true)} LLP have been reserved for vesting.`
                    }
                  />
                </div>
              </div>
            )} */}
            {/* <div className="App-card-row">
              <div className="label">
                <Trans>APR</Trans>
              </div>
              <div className="value">
                <Tooltip
                  handle={`${formatAmount(totalApr, 2, 2, true)}%`}
                  position="right-bottom"
                  renderContent={() => {
                    return (
                      <>
                        <StatsTooltipRow
                          label={t`${nativeTokenSymbol} (${wrappedTokenSymbol}) APR`}
                          value={`${formatAmount(feeGlpTrackerApr, 2, 2, false)}%`}
                          showDollar={false}
                        />
                      </>
                    );
                  }}
                />
              </div>
            </div> */}
            <div className="App-card-row">
              <div className="label">
                <Trans>Total Supply</Trans>
              </div>
              <div className="value">
                <Trans>
                  {formatAmount(glpSupply, GLP_DECIMALS, 4, true)} LLP ($
                  {formatAmount(glpSupplyUsd, USD_DECIMALS, 2, true)})
                </Trans>
              </div>
            </div>
          </div>
        </div>
        <div className="GlpSwap-box App-box">
          <Tab
            options={[t`Buy LLP`, t`Sell LLP`]}
            option={tabLabel}
            onChange={onSwapOptionChange}
            className="Exchange-swap-option-tabs"
          />
          {isBuying && (
            <BuyInputSection
              topLeftLabel={payLabel}
              topRightLabel={t`Balance:`}
              tokenBalance={`${formatAmount(swapTokenBalance, swapToken.decimals, 4, true)}`}
              inputValue={swapValue}
              onInputValueChange={onSwapValueChange}
              showMaxButton={swapValue !== formatAmountFree(swapTokenBalance, swapToken.decimals, swapToken.decimals)}
              onClickTopRightLabel={fillMaxAmount}
              onClickMax={fillMaxAmount}
              selectedToken={swapToken}
              balance={payBalance}
            >
              <TokenSelector
                label={t`Pay`}
                chainId={chainId}
                tokenAddress={swapTokenAddress}
                onSelectToken={onSelectSwapToken}
                tokens={whitelistedTokens}
                infoTokens={infoTokens}
                className="GlpSwap-from-token"
                showSymbolImage={true}
                showTokenImgInDropdown={true}
              />
            </BuyInputSection>
          )}

          {!isBuying && (
            <BuyInputSection
              topLeftLabel={payLabel}
              topRightLabel={t`Available:`}
              tokenBalance={`${formatAmount(maxSellAmount, GLP_DECIMALS, 4, true)}`}
              inputValue={glpValue}
              onInputValueChange={onGlpValueChange}
              showMaxButton={glpValue !== formatAmountFree(maxSellAmount, GLP_DECIMALS, GLP_DECIMALS)}
              onClickTopRightLabel={fillMaxAmount}
              onClickMax={fillMaxAmount}
              balance={payBalance}
              defaultTokenName={"LLP"}
            >
              <div className="selected-token">
                LLP <img src={glp24Icon} alt="mlp24Icon" />
              </div>
            </BuyInputSection>
          )}

          <div className="AppOrder-ball-container">
            <div className="AppOrder-ball">
              <img
                src={arrowIcon}
                alt="arrowIcon"
                onClick={() => {
                  setIsBuying(!isBuying);
                  switchSwapOption(isBuying ? "redeem" : "");
                }}
              />
            </div>
          </div>

          {isBuying && (
            <BuyInputSection
              topLeftLabel={receiveLabel}
              topRightLabel={t`Balance:`}
              tokenBalance={`${formatAmount(glpBalance, GLP_DECIMALS, 4, true)}`}
              inputValue={glpValue}
              onInputValueChange={onGlpValueChange}
              balance={receiveBalance}
              defaultTokenName={"LLP"}
            >
              <div className="selected-token">
                LLP <img src={glp24Icon} alt="mlp24Icon" />
              </div>
            </BuyInputSection>
          )}

          {!isBuying && (
            <BuyInputSection
              topLeftLabel={receiveLabel}
              topRightLabel={t`Balance:`}
              tokenBalance={`${formatAmount(swapTokenBalance, swapToken.decimals, 4, true)}`}
              inputValue={swapValue}
              onInputValueChange={onSwapValueChange}
              balance={receiveBalance}
              selectedToken={swapToken}
            >
              <TokenSelector
                label={t`Receive`}
                chainId={chainId}
                tokenAddress={swapTokenAddress}
                onSelectToken={onSelectSwapToken}
                tokens={whitelistedTokens}
                infoTokens={infoTokens}
                className="GlpSwap-from-token"
                showSymbolImage={true}
                showTokenImgInDropdown={true}
              />
            </BuyInputSection>
          )}

          <div>
            <div className="Exchange-info-row">
              <div className="Exchange-info-label">{feeBasisPoints > 50 ? t`WARNING: High Fees` : t`Fees`}</div>
              <div className="align-right fee-block">
                {isBuying && (
                  <Tooltip
                    handle={isBuying && isSwapTokenCapReached ? "NA" : feePercentageText}
                    position="right-bottom"
                    renderContent={() => {
                      if (!feeBasisPoints) {
                        return (
                          <div className="text-white">
                            <Trans>Fees will be shown once you have entered an amount in the order form.</Trans>
                          </div>
                        );
                      }
                      return (
                        <div className="text-white">
                          {feeBasisPoints > 50 && <Trans>To reduce fees, select a different asset to pay with.</Trans>}
                          <Trans>Check the "Save on Fees" section below to get the lowest fee percentages.</Trans>
                        </div>
                      );
                    }}
                  />
                )}
                {!isBuying && (
                  <Tooltip
                    handle={feePercentageText}
                    position="right-bottom"
                    renderContent={() => {
                      if (!feeBasisPoints) {
                        return (
                          <div className="text-white">
                            <Trans>Fees will be shown once you have entered an amount in the order form.</Trans>
                          </div>
                        );
                      }
                      return (
                        <div className="text-white">
                          {feeBasisPoints > 50 && <Trans>To reduce fees, select a different asset to receive.</Trans>}
                          <Trans>Check the "Save on Fees" section below to get the lowest fee percentages.</Trans>
                        </div>
                      );
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="GlpSwap-cta Exchange-swap-button-container">
            <button
              className="default-btn Exchange-swap-button"
              onClick={onClickPrimary}
              disabled={!isPrimaryEnabled()}
            >
              {getPrimaryText()}
            </button>
          </div>
        </div>
      </div>
      <StakeV2 rewardTokens={rewardTokens} />
      <div className="Tab-title-section">
        <div className="Page-title">
          <Trans>Save on Fees</Trans>
        </div>
        {isBuying && (
          <div className="Page-description">
            <Trans>
              Fees may vary depending on which asset you use to buy LLP. <br />
              Enter the amount of LLP you want to purchase in the order form, then check here to compare fees.
            </Trans>
          </div>
        )}
        {!isBuying && (
          <div className="Page-description">
            <Trans>
              Fees may vary depending on which asset you sell LLP for. <br />
              Enter the amount of LLP you want to redeem in the order form, then check here to compare fees.
            </Trans>
          </div>
        )}
      </div>
      <div className="GlpSwap-token-list card">
        {/* <div className="GlpSwap-token-list-content"> */}
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
                {isBuying ? (
                  <Tooltip
                    handle={t`AVAILABLE`}
                    tooltipIconPosition="right"
                    position="right-bottom text-none"
                    renderContent={() => (
                      <p className="text-white">
                        <Trans>Available amount to deposit into LLP.</Trans>
                      </p>
                    )}
                  />
                ) : (
                  <Tooltip
                    handle={t`AVAILABLE`}
                    tooltipIconPosition="right"
                    position="center-bottom text-none"
                    renderContent={() => {
                      return (
                        <p className="text-white">
                          <Trans>
                            Available amount to withdraw from LLP. Funds not utilized by current open positions.
                          </Trans>
                        </p>
                      );
                    }}
                  />
                )}
              </th>
              <th>
                <Trans>WALLET</Trans>
              </th>
              <th>
                <Tooltip
                  handle={t`FEES`}
                  tooltipIconPosition="right"
                  position="right-bottom text-none"
                  renderContent={() => {
                    return (
                      <div className="text-white">
                        <Trans>Fees will be shown once you have entered an amount in the order form.</Trans>
                      </div>
                    );
                  }}
                />
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {visibleTokens.map((token) => {
              let tokenFeeBps;
              if (isBuying) {
                const { feeBasisPoints: feeBps } = getBuyGlpFromAmount(
                  glpAmount,
                  token.address,
                  infoTokens,
                  glpPrice,
                  usdgSupply,
                  totalTokenWeights
                );
                tokenFeeBps = feeBps;
              } else {
                const { feeBasisPoints: feeBps } = getSellGlpToAmount(
                  glpAmount,
                  token.address,
                  infoTokens,
                  glpPrice,
                  usdgSupply,
                  totalTokenWeights
                );
                tokenFeeBps = feeBps;
              }
              const tokenInfo = getTokenInfo(infoTokens, token.address);
              let managedUsd;
              if (tokenInfo && tokenInfo.managedUsd) {
                managedUsd = tokenInfo.managedUsd;
              }
              let availableAmountUsd;
              if (tokenInfo && tokenInfo.minPrice && tokenInfo.availableAmount) {
                availableAmountUsd = tokenInfo.availableAmount
                  .mul(tokenInfo.minPrice)
                  .div(expandDecimals(1, token.decimals));
              }
              let balanceUsd;
              if (tokenInfo && tokenInfo.minPrice && tokenInfo.balance) {
                balanceUsd = tokenInfo.balance.mul(tokenInfo.minPrice).div(expandDecimals(1, token.decimals));
              }
              const tokenImage = importImage("ic_" + token.symbol.toLowerCase() + "_40.svg");
              let isCapReached = tokenInfo.managedAmount?.gt(tokenInfo.maxUsdgAmount);

              let amountLeftToDeposit = bigNumberify(0);
              if (tokenInfo.maxUsdgAmount && tokenInfo.maxUsdgAmount.gt(0)) {
                amountLeftToDeposit = tokenInfo.maxUsdgAmount
                  .sub(tokenInfo.usdgAmount)
                  .mul(expandDecimals(1, USD_DECIMALS))
                  .div(expandDecimals(1, USDG_DECIMALS));
              }
              if (amountLeftToDeposit.lt(0)) {
                amountLeftToDeposit = bigNumberify(0);
              }
              function renderFees() {
                const swapUrl = `https://app.1inch.io/#/${chainId}/swap/`;
                switch (true) {
                  case (isBuying && isCapReached) || (!isBuying && managedUsd?.lt(1)):
                    return (
                      <Tooltip
                        handle="NA"
                        position="right-bottom"
                        renderContent={() => (
                          <div className="text-white">
                            <Trans>
                              Max pool capacity reached for {tokenInfo.symbol}
                              <br />
                              <br />
                              Please mint LLP using another token
                            </Trans>
                            <br />
                            <p>
                              <ExternalLink href={swapUrl}>
                                <Trans> Swap {tokenInfo.symbol} on 1inch</Trans>
                              </ExternalLink>
                            </p>
                          </div>
                        )}
                      />
                    );
                  case (isBuying && !isCapReached) || (!isBuying && managedUsd?.gt(0)):
                    return `${formatAmount(tokenFeeBps, 2, 2, true, "-")}${
                      tokenFeeBps !== undefined && tokenFeeBps.toString().length > 0 ? "%" : ""
                    }`;
                  default:
                    return "";
                }
              }

              return (
                <tr key={token.symbol}>
                  <td>
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
                  </td>
                  <td>${formatKeyAmount(tokenInfo, "minPrice", USD_DECIMALS, 2, true)}</td>
                  <td>
                    {isBuying && (
                      <div>
                        <Tooltip
                          handle={
                            amountLeftToDeposit && amountLeftToDeposit.lt(0)
                              ? "$0.00"
                              : `$${formatAmount(amountLeftToDeposit, USD_DECIMALS, 2, true)}`
                          }
                          position="right-bottom"
                          tooltipIconPosition="right"
                          renderContent={() => getTooltipContent(managedUsd, tokenInfo, token)}
                        />
                      </div>
                    )}
                    {!isBuying && (
                      <div>
                        <Tooltip
                          handle={
                            availableAmountUsd && availableAmountUsd.lt(0)
                              ? "$0.00"
                              : `$${formatAmount(availableAmountUsd, USD_DECIMALS, 2, true)}`
                          }
                          position="right-bottom"
                          tooltipIconPosition="right"
                          renderContent={() => getTooltipContent(managedUsd, tokenInfo, token)}
                        />
                      </div>
                    )}
                  </td>
                  <td>
                    {formatKeyAmount(tokenInfo, "balance", tokenInfo.decimals, 2, true)} {tokenInfo.symbol} ($
                    {formatAmount(balanceUsd, USD_DECIMALS, 2, true)})
                  </td>
                  <td>{renderFees()}</td>
                  <td>
                    <button
                      className={cx("default-btn App-card-option action-btn", isBuying ? "buying" : "selling")}
                      onClick={() => selectToken(token)}
                    >
                      {isBuying ? t`Buy with ${token.symbol}` : t`Sell for ${token.symbol}`}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="token-grid">
          {visibleTokens.map((token) => {
            let tokenFeeBps;
            if (isBuying) {
              const { feeBasisPoints: feeBps } = getBuyGlpFromAmount(
                glpAmount,
                token.address,
                infoTokens,
                glpPrice,
                usdgSupply,
                totalTokenWeights
              );
              tokenFeeBps = feeBps;
            } else {
              const { feeBasisPoints: feeBps } = getSellGlpToAmount(
                glpAmount,
                token.address,
                infoTokens,
                glpPrice,
                usdgSupply,
                totalTokenWeights
              );
              tokenFeeBps = feeBps;
            }
            const tokenInfo = getTokenInfo(infoTokens, token.address);
            let managedUsd;
            if (tokenInfo && tokenInfo.managedUsd) {
              managedUsd = tokenInfo.managedUsd;
            }
            let availableAmountUsd;
            if (tokenInfo && tokenInfo.minPrice && tokenInfo.availableAmount) {
              availableAmountUsd = tokenInfo.availableAmount
                .mul(tokenInfo.minPrice)
                .div(expandDecimals(1, token.decimals));
            }
            let balanceUsd;
            if (tokenInfo && tokenInfo.minPrice && tokenInfo.balance) {
              balanceUsd = tokenInfo.balance.mul(tokenInfo.minPrice).div(expandDecimals(1, token.decimals));
            }

            let amountLeftToDeposit = bigNumberify(0);
            if (tokenInfo.maxUsdgAmount && tokenInfo.maxUsdgAmount.gt(0)) {
              amountLeftToDeposit = tokenInfo.maxUsdgAmount
                .sub(tokenInfo.usdgAmount)
                .mul(expandDecimals(1, USD_DECIMALS))
                .div(expandDecimals(1, USDG_DECIMALS));
            }
            if (amountLeftToDeposit.lt(0)) {
              amountLeftToDeposit = bigNumberify(0);
            }
            let isCapReached = tokenInfo.managedAmount?.gt(tokenInfo.maxUsdgAmount);

            function renderFees() {
              switch (true) {
                case (isBuying && isCapReached) || (!isBuying && managedUsd?.lt(1)):
                  return (
                    <Tooltip
                      handle="NA"
                      position="right-bottom"
                      renderContent={() => (
                        <Trans>
                          Max pool capacity reached for {tokenInfo.symbol}. Please mint LLP using another token
                        </Trans>
                      )}
                    />
                  );
                case (isBuying && !isCapReached) || (!isBuying && managedUsd?.gt(0)):
                  return `${formatAmount(tokenFeeBps, 2, 2, true, "-")}${
                    tokenFeeBps !== undefined && tokenFeeBps.toString().length > 0 ? "%" : ""
                  }`;
                default:
                  return "";
              }
            }
            const tokenImage = importImage("ic_" + token.symbol.toLowerCase() + "_24.svg");
            return (
              <div className="App-card" key={token.symbol}>
                <div className="mobile-token-card">
                  <img src={tokenImage} alt={token.symbol} width="20px" />
                  <div className="token-symbol-text">{token.symbol}</div>
                  <div>
                    <AssetDropdown assetSymbol={token.symbol} assetInfo={token} />
                  </div>
                </div>
                <div className="App-card-divider" />
                <div className="App-card-content">
                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Price</Trans>
                    </div>
                    <div>${formatKeyAmount(tokenInfo, "minPrice", USD_DECIMALS, 2, true)}</div>
                  </div>
                  {isBuying && (
                    <div className="App-card-row">
                      <Tooltip
                        handle="Available"
                        position="left-bottom"
                        renderContent={() => (
                          <p className="text-white">
                            <Trans>Available amount to deposit into LLP.</Trans>
                          </p>
                        )}
                      />
                      <div>
                        <Tooltip
                          handle={amountLeftToDeposit && `$${formatAmount(amountLeftToDeposit, USD_DECIMALS, 2, true)}`}
                          position="right-bottom"
                          tooltipIconPosition="right"
                          renderContent={() => getTooltipContent(managedUsd, tokenInfo, token)}
                        />
                      </div>
                    </div>
                  )}
                  {!isBuying && (
                    <div className="App-card-row">
                      <div className="label">
                        <Tooltip
                          handle={t`Available`}
                          position="left-bottom"
                          renderContent={() => {
                            return (
                              <p className="text-white">
                                <Trans>
                                  Available amount to withdraw from LLP. Funds not utilized by current open positions.
                                </Trans>
                              </p>
                            );
                          }}
                        />
                      </div>

                      <div>
                        <Tooltip
                          handle={
                            availableAmountUsd && availableAmountUsd.lt(0)
                              ? "$0.00"
                              : `$${formatAmount(availableAmountUsd, USD_DECIMALS, 2, true)}`
                          }
                          position="right-bottom"
                          tooltipIconPosition="right"
                          renderContent={() => getTooltipContent(managedUsd, tokenInfo, token)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="App-card-row">
                    <div className="label">
                      <Trans>Wallet</Trans>
                    </div>
                    <div>
                      {formatKeyAmount(tokenInfo, "balance", tokenInfo.decimals, 2, true)} {tokenInfo.symbol} ($
                      {formatAmount(balanceUsd, USD_DECIMALS, 2, true)})
                    </div>
                  </div>
                  <div className="App-card-row">
                    <div>
                      {tokenFeeBps ? (
                        t`Fees`
                      ) : (
                        <Tooltip
                          handle="Fees"
                          renderContent={() => (
                            <p className="text-white">
                              <Trans>Fees will be shown once you have entered an amount in the order form.</Trans>
                            </p>
                          )}
                        />
                      )}
                    </div>
                    <div>{renderFees()}</div>
                  </div>
                  <div className="App-card-divider"></div>
                  <div className="App-card-options">
                    {isBuying && (
                      <button className="default-btn App-card-option" onClick={() => selectToken(token)}>
                        <Trans>Buy with {token.symbol}</Trans>
                      </button>
                    )}
                    {!isBuying && (
                      <button className="default-btn App-card-option" onClick={() => selectToken(token)}>
                        <Trans>Sell for {token.symbol}</Trans>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
