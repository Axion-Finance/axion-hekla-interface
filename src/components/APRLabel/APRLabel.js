import React from "react";

import useSWR from "swr";

import {
  PLACEHOLDER_ACCOUNT,
  getBalanceAndSupplyData,
  getDepositBalanceData,
  getVestingData,
  getStakingData,
  getProcessedData,
} from "lib/legacy";

import Vault from "abis/Vault.json";
import ReaderV2 from "abis/ReaderV2.json";
import RewardReader from "abis/RewardReader.json";
import Token from "abis/Token.json";
import LlpManager from "abis/LlpManager.json";

import { useWeb3React } from "@web3-react/core";

import { useLiqPrice } from "domain/legacy";

import { getContract } from "config/contracts";
// import { getServerUrl } from "config/backend";
import { contractFetcher } from "lib/contracts";
import { formatKeyAmount } from "lib/numbers";

export default function APRLabel({ chainId, label }) {
  let { active } = useWeb3React();

  const rewardReaderAddress = getContract(chainId, "RewardReader");
  const readerAddress = getContract(chainId, "Reader");

  const vaultAddress = getContract(chainId, "Vault");
  const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");
  const liqAddress = getContract(chainId, "AXION");
  const esLIQAddress = getContract(chainId, "ES_LIQ");
  const bnLIQAddress = getContract(chainId, "BN_LIQ");
  const llpAddress = getContract(chainId, "LLP");
  const usdfAddress = getContract(chainId, "USDG");

  const stakedLiqTrackerAddress = getContract(chainId, "StakedLiqTracker");
  const bonusLiqTrackerAddress = getContract(chainId, "BonusLiqTracker");
  const feeLiqTrackerAddress = getContract(chainId, "FeeLiqTracker");

  const stakedGlpTrackerAddress = getContract(chainId, "StakedLlpTracker");
  const feeGlpTrackerAddress = getContract(chainId, "FeeLlpTracker");

  const glpManagerAddress = getContract(chainId, "LlpManager");

  const liqVesterAddress = getContract(chainId, "LiqVester");
  const glpVesterAddress = getContract(chainId, "LlpVester");

  const vesterAddresses = [liqVesterAddress, glpVesterAddress];

  const walletTokens = [liqAddress, esLIQAddress, llpAddress, stakedLiqTrackerAddress];
  const depositTokens = [
    liqAddress,
    esLIQAddress,
    stakedLiqTrackerAddress,
    bonusLiqTrackerAddress,
    bnLIQAddress,
    llpAddress,
  ];
  const rewardTrackersForDepositBalances = [
    stakedLiqTrackerAddress,
    stakedLiqTrackerAddress,
    bonusLiqTrackerAddress,
    feeLiqTrackerAddress,
    feeLiqTrackerAddress,
    feeGlpTrackerAddress,
  ];
  const rewardTrackersForStakingInfo = [
    stakedLiqTrackerAddress,
    bonusLiqTrackerAddress,
    feeLiqTrackerAddress,
    stakedGlpTrackerAddress,
    feeGlpTrackerAddress,
  ];

  const { data: walletBalances } = useSWR(
    [`StakeV2:walletBalances:${active}`, chainId, readerAddress, "getTokenBalancesWithSupplies", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, ReaderV2, [walletTokens]),
    }
  );

  const { data: depositBalances } = useSWR(
    [`StakeV2:depositBalances:${active}`, chainId, rewardReaderAddress, "getDepositBalances", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, RewardReader, [depositTokens, rewardTrackersForDepositBalances]),
    }
  );

  const { data: stakingInfo } = useSWR(
    [`StakeV2:stakingInfo:${active}`, chainId, rewardReaderAddress, "getStakingInfo", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, RewardReader, [rewardTrackersForStakingInfo]),
    }
  );

  const { data: stakedLIQSupply } = useSWR(
    [`StakeV2:stakedLIQSupply:${active}`, chainId, liqAddress, "balanceOf", stakedLiqTrackerAddress],
    {
      fetcher: contractFetcher(undefined, Token),
    }
  );

  const { data: aums } = useSWR([`StakeV2:getAums:${active}`, chainId, glpManagerAddress, "getAums"], {
    fetcher: contractFetcher(undefined, LlpManager),
  });

  const { data: nativeTokenPrice } = useSWR(
    [`StakeV2:nativeTokenPrice:${active}`, chainId, vaultAddress, "getMinPrice", nativeTokenAddress],
    {
      fetcher: contractFetcher(undefined, Vault),
    }
  );

  const { data: vestingInfo } = useSWR(
    [`StakeV2:vestingInfo:${active}`, chainId, readerAddress, "getVestingInfo", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, ReaderV2, [vesterAddresses]),
    }
  );
  const tokensForSupplyQuery = [liqAddress, llpAddress, usdfAddress];

  const { data: totalSupplies } = useSWR(
    [`StakeV2:totalSupplies:${active}`, chainId, readerAddress, "getTokenBalancesWithSupplies", PLACEHOLDER_ACCOUNT],
    {
      fetcher: contractFetcher(undefined, ReaderV2, [tokensForSupplyQuery]),
    }
  );
  const { axionPrice } = useLiqPrice(chainId, {}, active);
  // const { totalSupply: liqSupply} = useLIQLIQnfo();
  let liqSupply;
  if (totalSupplies && totalSupplies[1]) {
    liqSupply = totalSupplies[1];
  }
  // const liqSupplyUrl = getServerUrl(chainId, "/liq_supply");
  // const { data: liqSupply } = useSWR([liqSupplyUrl], {
  //   fetcher: (...args) => fetch(...args).then((res) => res.text()),
  // });
  let aum;
  if (aums && aums.length > 0) {
    aum = aums[0].add(aums[1]).div(2);
  }

  const { balanceData, supplyData } = getBalanceAndSupplyData(walletBalances);
  const depositBalanceData = getDepositBalanceData(depositBalances);
  const stakingData = getStakingData(stakingInfo);
  const vestingData = getVestingData(vestingInfo);

  const processedData = getProcessedData(
    balanceData,
    supplyData,
    depositBalanceData,
    stakingData,
    vestingData,
    aum,
    nativeTokenPrice,
    stakedLIQSupply,
    axionPrice,
    liqSupply
  );

  return <>{`${formatKeyAmount(processedData, label, 2, 2, true)}%`}</>;
}
