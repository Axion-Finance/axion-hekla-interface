import { gql } from "@apollo/client";
// import { Token as UniToken } from "@uniswap/sdk-core";
// import { Pool } from "@uniswap/v3-sdk";
import { BigNumber, ethers } from "ethers";
import { useCallback, useEffect, /*useMemo,*/ useRef, useState } from "react";
import useSWR from "swr";

import OrderBook from "abis/OrderBook.json";
import PositionManager from "abis/PositionManager.json";
import Router from "abis/Router.json";
// import UniPool from "abis/UniPool.json";
// import UniswapV2 from "abis/UniswapV2.json";
import Vault from "abis/Vault.json";

import PositionRouter from "abis/PositionRouter.json";
import Token from "abis/Token.json";

import {
  ARBITRUM,
  ARBITRUM_TESTNET,
  AVALANCHE,
  TAIKO_MAINNET,
  TAIKO_TESTNET,
  getConstant,
  getHighExecutionFee,
} from "config/chains";
import { getContract } from "config/contracts";
import { DECREASE, INCREASE, SWAP, USD_DECIMALS, getOrderKey } from "lib/legacy";

import { t } from "@lingui/macro";
import { getServerBaseUrl, getServerUrl } from "config/backend";
import { LIQ_PRICE } from "config/ui";

import { callContract, contractFetcher } from "lib/contracts";
import { bigNumberify, expandDecimals, parseValue } from "lib/numbers";
import { getProvider } from "lib/rpc";
import { getLiqGraphClient, nissohGraphClient } from "lib/subgraph/clients";
import { groupBy } from "lodash";
import { replaceNativeTokenAddress } from "./tokens";
import { getUsd } from "./tokens/utils";

export * from "./prices";

const { AddressZero } = ethers.constants;

export function useAllOrdersStats(chainId) {
  const query = gql(`{
    orderStat(id: "total") {
      openSwap
      openIncrease
      openDecrease
      executedSwap
      executedIncrease
      executedDecrease
      cancelledSwap
      cancelledIncrease
      cancelledDecrease
    }
  }`);

  const [res, setRes] = useState<any>();

  useEffect(() => {
    const graphClient = getLiqGraphClient(chainId);
    if (graphClient) {
      // eslint-disable-next-line no-console
      graphClient.query({ query }).then(setRes).catch(console.warn);
    }
  }, [setRes, query, chainId]);

  return res ? res.data.orderStat : null;
}

export function useUserStat(chainId) {
  const query = gql(`{
    userStat(id: "total") {
      id
      uniqueCount
    }
  }`);

  const [res, setRes] = useState<any>();

  useEffect(() => {
    // eslint-disable-next-line no-console
    getLiqGraphClient(chainId)?.query({ query }).then(setRes).catch(console.warn);
  }, [setRes, query, chainId]);

  return res ? res.data.userStat : null;
}

export function useLiquidationsData(chainId, account) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (account) {
      const query = gql(`{
         liquidatedPositions(
           where: {account: "${account.toLowerCase()}"}
           first: 100
           orderBy: timestamp
           orderDirection: desc
         ) {
           key
           timestamp
           borrowFee
           loss
           collateral
           size
           markPrice
           type
         }
      }`);
      const graphClient = getLiqGraphClient(chainId);
      if (!graphClient) {
        return;
      }

      graphClient
        .query({ query })
        .then((res) => {
          const _data = res.data.liquidatedPositions.map((item) => {
            return {
              ...item,
              size: bigNumberify(item.size),
              collateral: bigNumberify(item.collateral),
              markPrice: bigNumberify(item.markPrice),
            };
          });
          setData(_data);
        })
        // eslint-disable-next-line no-console
        .catch(console.warn);
    }
  }, [setData, chainId, account]);

  return data;
}

export function useAllPositions(chainId, library) {
  const count = 1000;
  const query = gql(`{
    aggregatedTradeOpens(
      first: ${count}
    ) {
      account
      initialPosition{
        indexToken
        collateralToken
        isLong
        sizeDelta
      }
      increaseList {
        sizeDelta
      }
      decreaseList {
        sizeDelta
      }
    }
  }`);

  const [res, setRes] = useState<any>();

  useEffect(() => {
    // eslint-disable-next-line no-console
    nissohGraphClient.query({ query }).then(setRes).catch(console.warn);
  }, [setRes, query]);

  const key = res ? `allPositions${count}__` : null;

  const { data: positions = [] } = useSWR(key, async () => {
    const provider = getProvider(library, chainId);
    const vaultAddress = getContract(chainId, "Vault");
    const contract = new ethers.Contract(vaultAddress, Vault.abi, provider);
    const ret = await Promise.all(
      res.data.aggregatedTradeOpens.map(async (dataItem) => {
        try {
          const { indexToken, collateralToken, isLong } = dataItem.initialPosition;
          const positionData = await contract.getPosition(dataItem.account, collateralToken, indexToken, isLong);
          const position: any = {
            size: bigNumberify(positionData[0]),
            collateral: bigNumberify(positionData[1]),
            entryFundingRate: bigNumberify(positionData[3]),
            account: dataItem.account,
          };
          position.fundingFee = await contract.getFundingFee(collateralToken, position.size, position.entryFundingRate);
          position.marginFee = position.size.div(1000);
          position.fee = position.fundingFee.add(position.marginFee);

          const THRESHOLD = 5000;
          const collateralDiffPercent = position.fee.mul(10000).div(position.collateral);
          position.danger = collateralDiffPercent.gt(THRESHOLD);

          return position;
        } catch (ex) {
          // eslint-disable-next-line no-console
          console.error(ex);
        }
      })
    );

    return ret.filter(Boolean);
  });

  return positions;
}

export function useAllOrders(chainId, library) {
  const query = gql(`{
    orders(
      first: 1000,
      orderBy: createdTimestamp,
      orderDirection: desc,
      where: {status: "open"}
    ) {
      type
      account
      index
      status
      createdTimestamp
    }
  }`);

  const [res, setRes] = useState<any>();

  useEffect(() => {
    getLiqGraphClient(chainId)?.query({ query }).then(setRes);
  }, [setRes, query, chainId]);

  const key = res ? res.data.orders.map((order) => `${order.type}-${order.account}-${order.index}`) : null;
  const { data: orders = [] } = useSWR(key, () => {
    const provider = getProvider(library, chainId);
    const orderBookAddress = getContract(chainId, "OrderBook");
    const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, provider);
    return Promise.all(
      res.data.orders.map(async (order) => {
        try {
          const type = order.type.charAt(0).toUpperCase() + order.type.substring(1);
          const method = `get${type}Order`;
          const orderFromChain = await contract[method](order.account, order.index);
          const ret: any = {};
          for (const [key, val] of Object.entries(orderFromChain)) {
            ret[key] = val;
          }
          if (order.type === "swap") {
            ret.path = [ret.path0, ret.path1, ret.path2].filter((address) => address !== AddressZero);
          }
          ret.type = type;
          ret.index = order.index;
          ret.account = order.account;
          ret.createdTimestamp = order.createdTimestamp;
          return ret;
        } catch (ex) {
          // eslint-disable-next-line no-console
          console.error(ex);
        }
      })
    );
  });

  return orders.filter(Boolean);
}

export function usePositionsForOrders(chainId, library, orders) {
  const key = orders ? orders.map((order) => getOrderKey(order) + "____") : null;
  const { data: positions = {} } = useSWR(key, async () => {
    const provider = getProvider(library, chainId);
    const vaultAddress = getContract(chainId, "Vault");
    const contract = new ethers.Contract(vaultAddress, Vault.abi, provider);
    const data = await Promise.all(
      orders.map(async (order) => {
        try {
          const position = await contract.getPosition(
            order.account,
            order.collateralToken,
            order.indexToken,
            order.isLong
          );
          if (position[0].eq(0)) {
            return [null, order];
          }
          return [position, order];
        } catch (ex) {
          // eslint-disable-next-line no-console
          console.error(ex);
        }
      })
    );
    return data.reduce((memo, [position, order]) => {
      memo[getOrderKey(order)] = position;
      return memo;
    }, {});
  });

  return positions;
}

function invariant(condition, errorMsg) {
  if (!condition) {
    throw new Error(errorMsg);
  }
}

export function useTrades(chainId, account, forSingleAccount, afterId) {
  let url =
    account && account.length > 0
      ? `${getServerBaseUrl(chainId)}/trades?address=${account.toLowerCase()}`
      : !forSingleAccount && `${getServerBaseUrl(chainId)}/trades`;

  if (afterId && afterId.length > 0) {
    const urlItem = new URL(url as string);
    urlItem.searchParams.append("after", afterId);
    url = urlItem.toString();
  }

  const { data: trades, mutate: updateTrades } = useSWR(url ? url : null, {
    dedupingInterval: 10000,
    // @ts-ignore
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
  });
  if (trades && !trades.error) {
    trades.sort((item0, item1) => {
      const data0 = item0;
      const data1 = item1;
      const time0 = parseInt(data0.timestamp);
      const time1 = parseInt(data1.timestamp);
      if (time1 > time0) {
        return 1;
      }
      if (time1 < time0) {
        return -1;
      }

      const block0 = parseInt(data0.blockNumber);
      const block1 = parseInt(data1.blockNumber);

      if (isNaN(block0) && isNaN(block1)) {
        return 0;
      }

      if (isNaN(block0)) {
        return 1;
      }

      if (isNaN(block1)) {
        return -1;
      }

      if (block1 > block0) {
        return 1;
      }

      if (block1 < block0) {
        return -1;
      }

      return 0;
    });
  }

  return { trades, updateTrades };
}

export function useMinExecutionFee(library, active, chainId, infoTokens) {
  const positionRouterAddress = getContract(chainId, "PositionRouter");
  const nativeTokenAddress = getContract(chainId, "NATIVE_TOKEN");

  const { data: minExecutionFee } = useSWR<BigNumber>([active, chainId, positionRouterAddress, "minExecutionFee"], {
    fetcher: contractFetcher(library, PositionRouter),
  });

  const { data: gasPrice } = useSWR<BigNumber | undefined>(["gasPrice", chainId], {
    fetcher: () => {
      return new Promise(async (resolve, reject) => {
        const provider = getProvider(library, chainId);
        if (!provider) {
          resolve(undefined);
          return;
        }

        try {
          const gasPrice = await provider.getGasPrice();
          resolve(gasPrice);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      });
    },
  });

  let multiplier;

  // if gas prices on Arbitrum are high, the main transaction costs would come from the L2 gas usage
  // for executing positions this is around 65,000 gas
  // if gas prices on Ethereum are high, than the gas usage might be higher, this calculation doesn't deal with that
  // case yet
  if (chainId === ARBITRUM || chainId === ARBITRUM_TESTNET) {
    multiplier = 65000;
  }

  // multiplier for Avalanche is just the average gas usage
  if (chainId === AVALANCHE) {
    multiplier = 700000;
  }
  if (chainId === TAIKO_MAINNET) {
    multiplier = 700000;
  }

  if (chainId === TAIKO_TESTNET) {
    multiplier = 700000;
  }

  let finalExecutionFee = minExecutionFee;

  if (gasPrice && minExecutionFee) {
    const estimatedExecutionFee = gasPrice.mul(multiplier);
    if (estimatedExecutionFee.gt(minExecutionFee)) {
      finalExecutionFee = estimatedExecutionFee;
    }
  }

  const finalExecutionFeeUSD = getUsd(finalExecutionFee, nativeTokenAddress, false, infoTokens);
  const isFeeHigh = finalExecutionFeeUSD?.gt(expandDecimals(getHighExecutionFee(chainId), USD_DECIMALS));
  const errorMessage =
    isFeeHigh &&
    `The network cost to send transactions is high at the moment, please check the "Execution Fee" value before proceeding.`;

  return {
    minExecutionFee: finalExecutionFee,
    minExecutionFeeUSD: finalExecutionFeeUSD,
    minExecutionFeeErrorMessage: errorMessage,
  };
}

export function useStakedLiqSupply(library, active) {
  const liqAddressArb = getContract(ARBITRUM, "AXION");
  const stakedLiqTrackerAddressArb = getContract(ARBITRUM, "StakedLiqTracker");

  const { data: arbData, mutate: arbMutate } = useSWR<any>(
    [`StakeV2:stakedLiqSupply:${active}`, ARBITRUM, liqAddressArb, "balanceOf", stakedLiqTrackerAddressArb],
    {
      fetcher: contractFetcher(library, Token),
    }
  );

  const liqAddressAvax = getContract(AVALANCHE, "AXION");
  const stakedLiqTrackerAddressAvax = getContract(AVALANCHE, "StakedLiqTracker");

  const { data: avaxData, mutate: avaxMutate } = useSWR(
    [`StakeV2:stakedLiqSupply:${active}`, AVALANCHE, liqAddressAvax, "balanceOf", stakedLiqTrackerAddressAvax],
    {
      fetcher: contractFetcher(undefined, Token),
    }
  );

  let data;
  if (arbData && avaxData) {
    data = arbData.add(avaxData);
  }

  const mutate = () => {
    arbMutate();
    avaxMutate();
  };

  return { data, mutate };
}

export function useHasOutdatedUi() {
  // const url = getServerUrl(ARBITRUM, "/ui_version");
  // const { data, mutate } = useSWR([url], {
  //   // @ts-ignore
  //   fetcher: (...args) => fetch(...args).then((res) => res.text()),
  // });

  let hasOutdatedUi = false;

  // if (data && parseFloat(data) > parseFloat(UI_VERSION)) {
  //   hasOutdatedUi = true;
  // }

  return { data: hasOutdatedUi };
}
export function useLIQLIQnfo() {
  const url = "https://api-hekla.axion.finance/api/tokens/info?symbols=AXIONAXION&chain=TAIKO_MAINNET";
  const { data } = useSWR([url], {
    // @ts-ignore
    fetcher: (...args) => fetch(...args).then((res) => res.json()),
  });
  return {
    totalSupply: 0, //parseValue(data?.LIQLIQ?.totalSupply, 18) || 0,
    totalLiqSupply: 0, //parseValue(data?.LIQLIQ?.circulatingSupply, 18) || 0,
    axionPrice: 0, //parseValue(data?.LIQLIQ?.price, USD_DECIMALS) || 0,
  };
}
export function useLiqPrice(chainId, libraries, active) {
  return {
    axionPrice: LIQ_PRICE,
  };

  // const arbitrumLibrary = libraries && libraries.arbitrum ? libraries.arbitrum : undefined;
  // //const { data: liqPriceFromArbitrum, mutate: mutateFromArbitrum } = useLiqPriceFromArbitrum(arbitrumLibrary, active);
  // //const { data: liqPriceFromAvalanche, mutate: mutateFromAvalanche } = useLiqPriceFromAvalanche();
  // const { data: liqPriceFromFantom, mutate: mutateFromFantom } = useLiqPriceFromModeTestnet();

  // const axionPrice = liqPriceFromFantom;
  // const mutate = useCallback(() => {
  //   mutateFromFantom();
  // }, [mutateFromFantom]);

  // return {
  //   axionPrice,
  //   //liqPriceFromArbitrum,
  //   //liqPriceFromAvalanche,
  //   mutate,
  // };
}

// use only the supply endpoint on arbitrum, it includes the supply on avalanche
export function useTotalLiqSupply() {
  const liqSupplyUrlArbitrum = getServerUrl(ARBITRUM, "/liq_supply");

  const { data: liqSupply, mutate: updateLiqSupply } = useSWR([liqSupplyUrlArbitrum], {
    // @ts-ignore
    fetcher: (...args) => fetch(...args).then((res) => res.text()),
  });

  return {
    total: liqSupply ? bigNumberify(liqSupply) : undefined,
    mutate: updateLiqSupply,
  };
}

export function useTotalLiqStaked() {
  const stakedLiqTrackerAddressArbitrum = getContract(ARBITRUM, "StakedLiqTracker");
  const stakedLiqTrackerAddressAvax = getContract(AVALANCHE, "StakedLiqTracker");
  const stakedLiqTrackerAddressFtm = getContract(TAIKO_MAINNET, "StakedLiqTracker");
  let totalStakedLiq = useRef(bigNumberify(0));
  // const { data: stakedLiqSupplyArbitrum, mutate: updateStakedLiqSupplyArbitrum } = useSWR<BigNumber>(
  //   [
  //     `StakeV2:stakedLiqSupply:${ARBITRUM}`,
  //     ARBITRUM,
  //     getContract(ARBITRUM, "AXION"),
  //     "balanceOf",
  //     stakedLiqTrackerAddressArbitrum,
  //   ],
  //   {
  //     fetcher: contractFetcher(undefined, Token),
  //   }
  // );
  // const { data: stakedLiqSupplyAvax, mutate: updateStakedLiqSupplyAvax } = useSWR<BigNumber>(
  //   [
  //     `StakeV2:stakedLiqSupply:${AVALANCHE}`,
  //     AVALANCHE,
  //     getContract(AVALANCHE, "AXION"),
  //     "balanceOf",
  //     stakedLiqTrackerAddressAvax,
  //   ],
  //   {
  //     fetcher: contractFetcher(undefined, Token),
  //   }
  // );
  const { data: stakedLiqSupplyFtm, mutate: updateStakedLiqSupplyFtm } = useSWR<BigNumber>(
    [
      `StakeV2:stakedLiqSupply:${TAIKO_MAINNET}`,
      TAIKO_MAINNET,
      getContract(TAIKO_MAINNET, "AXION"),
      "balanceOf",
      stakedLiqTrackerAddressFtm,
    ],
    {
      fetcher: contractFetcher(undefined, Token),
    }
  );

  const mutate = useCallback(() => {
    // updateStakedLiqSupplyArbitrum();
    // updateStakedLiqSupplyAvax();
    updateStakedLiqSupplyFtm();
  }, [updateStakedLiqSupplyFtm]);

  if (stakedLiqSupplyFtm) {
    let total = bigNumberify(stakedLiqSupplyFtm);
    totalStakedLiq.current = total;
  }

  return {
    // avax: stakedLiqSupplyAvax,
    // arbitrum: stakedLiqSupplyArbitrum,
    total: totalStakedLiq.current,
    mutate,
  };
}

export function useTotalLiqInLiquidity() {
  // let poolAddressArbitrum = getContract(ARBITRUM, "UniswapLiqEthPool");
  // let poolAddressAvax = getContract(AVALANCHE, "TraderJoeLiqAvaxPool");
  let poolAddressFtm = getContract(TAIKO_MAINNET, "UniswapLiqEthPool");
  let totalLIQ = useRef(bigNumberify(0));

  // const { data: liqInLiquidityOnArbitrum, mutate: mutateLIQInLiquidityOnArbitrum } = useSWR<any>(
  //   [`StakeV2:liqInLiquidity:${ARBITRUM}`, ARBITRUM, getContract(ARBITRUM, "AXION"), "balanceOf", poolAddressArbitrum],
  //   {
  //     fetcher: contractFetcher(undefined, Token),
  //   }
  // );
  // const { data: liqInLiquidityOnAvax, mutate: mutateLIQInLiquidityOnAvax } = useSWR<any>(
  //   [`StakeV2:liqInLiquidity:${AVALANCHE}`, AVALANCHE, getContract(AVALANCHE, "AXION"), "balanceOf", poolAddressAvax],
  //   {
  //     fetcher: contractFetcher(undefined, Token),
  //   }
  // );
  const { data: liqInLiquidityOnFtm, mutate: mutateLIQInLiquidityOnFtm } = useSWR<any>(
    [
      `StakeV2:liqInLiquidity:${TAIKO_MAINNET}`,
      TAIKO_MAINNET,
      getContract(TAIKO_MAINNET, "AXION"),
      "balanceOf",
      poolAddressFtm,
    ],
    {
      fetcher: contractFetcher(undefined, Token),
    }
  );
  const mutate = useCallback(() => {
    mutateLIQInLiquidityOnFtm();
  }, [mutateLIQInLiquidityOnFtm]);

  if (liqInLiquidityOnFtm) {
    let total = bigNumberify(liqInLiquidityOnFtm);
    totalLIQ.current = total;
  }
  return {
    total: totalLIQ.current,
    mutate,
  };
}

// function useLiqPriceFromModeTestnet() {
//   const poolAddress = getContract(TAIKO_MAINNET, "UniswapLiqEthPool");

//   const { data, mutate: updateReserves } = useSWR(
//     ["TraderJoeLiqFantomReserves", TAIKO_MAINNET, poolAddress, "getReserves"],
//     {
//       fetcher: contractFetcher(undefined, UniswapV2),
//     }
//   );
//   const { _reserve0: liqReserve, _reserve1: kavaReserve }: any = data || {};

//   const vaultAddress = getContract(TAIKO_MAINNET, "Vault");
//   const croAddress = getTokenBySymbol(TAIKO_MAINNET, "WETH").address;
//   const { data: ethPrice, mutate: updateUsdcPrice } = useSWR(
//     [`StakeV2:ethPrice`, TAIKO_MAINNET, vaultAddress, "getMinPrice", croAddress],
//     {
//       fetcher: contractFetcher(undefined, Vault),
//     }
//   );

//   const PRECISION = bigNumberify(10)!.pow(18);
//   let axionPrice;
//   //console.log(kavaReserve.toString(), liqReserve.toString(),ethPrice)
//   if (kavaReserve && liqReserve && ethPrice) {
//     axionPrice = kavaReserve.mul(PRECISION).div(liqReserve).mul(ethPrice).div(PRECISION);
//   }

//   const mutate = useCallback(() => {
//     updateReserves(undefined, true);
//     updateUsdcPrice(undefined, true);
//   }, [updateReserves, updateUsdcPrice]);

//   return { data: axionPrice, mutate };
// }

// function useLiqPriceFromAvalanche() {
//   const poolAddress = getContract(AVALANCHE, "TraderJoeLiqAvaxPool");

//   const { data, mutate: updateReserves } = useSWR(["TraderJoeLiqAvaxReserves", AVALANCHE, poolAddress, "getReserves"], {
//     fetcher: contractFetcher(undefined, UniswapV2),
//   });
//   const { _reserve0: liqReserve, _reserve1: avaxReserve }: any = data || {};

//   const vaultAddress = getContract(AVALANCHE, "Vault");
//   const avaxAddress = getTokenBySymbol(AVALANCHE, "WAVAX").address;
//   const { data: avaxPrice, mutate: updateAvaxPrice } = useSWR(
//     [`StakeV2:avaxPrice`, AVALANCHE, vaultAddress, "getMinPrice", avaxAddress],
//     {
//       fetcher: contractFetcher(undefined, Vault),
//     }
//   );

//   const PRECISION = bigNumberify(10)!.pow(18);
//   let axionPrice;
//   if (avaxReserve && liqReserve && avaxPrice) {
//     axionPrice = avaxReserve.mul(PRECISION).div(liqReserve).mul(avaxPrice).div(PRECISION);
//   }

//   const mutate = useCallback(() => {
//     updateReserves(undefined, true);
//     updateAvaxPrice(undefined, true);
//   }, [updateReserves, updateAvaxPrice]);

//   return { data: axionPrice, mutate };
// }

// function useLiqPriceFromArbitrum(library, active) {
//   const poolAddress = getContract(ARBITRUM, "UniswapLiqEthPool");
//   const { data: uniPoolSlot0, mutate: updateUniPoolSlot0 } = useSWR<any>(
//     [`StakeV2:uniPoolSlot0:${active}`, ARBITRUM, poolAddress, "slot0"],
//     {
//       fetcher: contractFetcher(library, UniPool),
//     }
//   );

//   const vaultAddress = getContract(ARBITRUM, "Vault");
//   const ethAddress = getTokenBySymbol(ARBITRUM, "WETH").address;
//   const { data: ethPrice, mutate: updateEthPrice } = useSWR<BigNumber>(
//     [`StakeV2:ethPrice:${active}`, ARBITRUM, vaultAddress, "getMinPrice", ethAddress],
//     {
//       fetcher: contractFetcher(library, Vault),
//     }
//   );

//   const axionPrice = useMemo(() => {
//     if (uniPoolSlot0 && ethPrice) {
//       const tokenA = new UniToken(ARBITRUM, ethAddress, 18, "SYMBOL", "NAME");

//       const liqAddress = getContract(ARBITRUM, "AXION");
//       const tokenB = new UniToken(ARBITRUM, liqAddress, 18, "SYMBOL", "NAME");

//       const pool = new Pool(
//         tokenA, // tokenA
//         tokenB, // tokenB
//         10000, // fee
//         uniPoolSlot0.sqrtPriceX96, // sqrtRatioX96
//         1, // liquidity
//         uniPoolSlot0.tick, // tickCurrent
//         []
//       );

//       const poolTokenPrice = pool.priceOf(tokenB).toSignificant(6);
//       const poolTokenPriceAmount = parseValue(poolTokenPrice, 18);
//       return poolTokenPriceAmount?.mul(ethPrice).div(expandDecimals(1, 18));
//     }
//   }, [ethPrice, uniPoolSlot0, ethAddress]);

//   const mutate = useCallback(() => {
//     updateUniPoolSlot0(undefined, true);
//     updateEthPrice(undefined, true);
//   }, [updateEthPrice, updateUniPoolSlot0]);

//   return { data: axionPrice, mutate };
// }

export async function approvePlugin(chainId, pluginAddress, { library, setPendingTxns, sentMsg, failMsg }) {
  const routerAddress = getContract(chainId, "Router");
  const contract = new ethers.Contract(routerAddress, Router.abi, library.getSigner());
  return callContract(chainId, contract, "approvePlugin", [pluginAddress], {
    sentMsg,
    failMsg,
    setPendingTxns,
  });
}

export async function createSwapOrder(
  chainId,
  library,
  path,
  amountIn,
  minOut,
  triggerRatio,
  nativeTokenAddress,
  opts: any = {}
) {
  const executionFee = getConstant(chainId, "SWAP_ORDER_EXECUTION_GAS_FEE");
  const triggerAboveThreshold = false;
  let shouldWrap = false;
  let shouldUnwrap = false;
  opts.value = executionFee;

  if (path[0] === AddressZero) {
    shouldWrap = true;
    opts.value = opts.value.add(amountIn);
  }
  if (path[path.length - 1] === AddressZero) {
    shouldUnwrap = true;
  }
  path = replaceNativeTokenAddress(path, nativeTokenAddress);

  const params = [path, amountIn, minOut, triggerRatio, triggerAboveThreshold, executionFee, shouldWrap, shouldUnwrap];

  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, "createSwapOrder", params, opts);
}

export async function createIncreaseOrder(
  chainId,
  library,
  nativeTokenAddress,
  path,
  amountIn,
  indexTokenAddress,
  minOut,
  sizeDelta,
  collateralTokenAddress,
  isLong,
  triggerPrice,
  opts: any = {}
) {
  invariant(!isLong || indexTokenAddress === collateralTokenAddress, "invalid token addresses");
  invariant(indexTokenAddress !== AddressZero, "indexToken is 0");
  invariant(collateralTokenAddress !== AddressZero, "collateralToken is 0");

  const fromETH = path[0] === AddressZero;

  path = replaceNativeTokenAddress(path, nativeTokenAddress);
  const shouldWrap = fromETH;
  const triggerAboveThreshold = !isLong;
  const executionFee = getConstant(chainId, "INCREASE_ORDER_EXECUTION_GAS_FEE");

  const params = [
    path,
    amountIn,
    indexTokenAddress,
    minOut,
    sizeDelta,
    collateralTokenAddress,
    isLong,
    triggerPrice,
    triggerAboveThreshold,
    executionFee,
    shouldWrap,
  ];

  if (!opts.value) {
    opts.value = fromETH ? amountIn.add(executionFee) : executionFee;
  }

  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, "createIncreaseOrder", params, opts);
}

export async function createDecreaseOrder(
  chainId,
  library,
  indexTokenAddress,
  sizeDelta,
  collateralTokenAddress,
  collateralDelta,
  isLong,
  triggerPrice,
  triggerAboveThreshold,
  opts: any = {}
) {
  invariant(!isLong || indexTokenAddress === collateralTokenAddress, "invalid token addresses");
  invariant(indexTokenAddress !== AddressZero, "indexToken is 0");
  invariant(collateralTokenAddress !== AddressZero, "collateralToken is 0");

  const executionFee = getConstant(chainId, "DECREASE_ORDER_EXECUTION_GAS_FEE");

  const params = [
    indexTokenAddress,
    sizeDelta,
    collateralTokenAddress,
    collateralDelta,
    isLong,
    triggerPrice,
    triggerAboveThreshold,
  ];
  opts.value = executionFee;
  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, "createDecreaseOrder", params, opts);
}

export async function cancelSwapOrder(chainId, library, index, opts) {
  const params = [index];
  const method = "cancelSwapOrder";
  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, method, params, opts);
}

export async function cancelDecreaseOrder(chainId, library, index, opts) {
  const params = [index];
  const method = "cancelDecreaseOrder";
  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, method, params, opts);
}

export async function cancelIncreaseOrder(chainId, library, index, opts) {
  const params = [index];
  const method = "cancelIncreaseOrder";
  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, method, params, opts);
}

export function handleCancelOrder(chainId, library, order, opts) {
  let func;
  if (order.type === SWAP) {
    func = cancelSwapOrder;
  } else if (order.type === INCREASE) {
    func = cancelIncreaseOrder;
  } else if (order.type === DECREASE) {
    func = cancelDecreaseOrder;
  }

  return func(chainId, library, order.index, {
    successMsg: t`Order cancelled.`,
    failMsg: t`Cancel failed.`,
    sentMsg: t`Cancel submitted.`,
    pendingTxns: opts.pendingTxns,
    setPendingTxns: opts.setPendingTxns,
  });
}

export async function cancelMultipleOrders(chainId, library, allIndexes, opts) {
  const ordersWithTypes = groupBy(allIndexes, (v) => v.split("-")[0]);
  function getIndexes(key) {
    if (!ordersWithTypes[key]) return;
    return ordersWithTypes[key].map((d) => d.split("-")[1]);
  }
  // params order => swap, increase, decrease
  const params = ["Swap", "Increase", "Decrease"].map((key) => getIndexes(key) || []);
  const method = "cancelMultiple";
  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());
  return callContract(chainId, contract, method, params, opts);
}

export async function updateDecreaseOrder(
  chainId,
  library,
  index,
  collateralDelta,
  sizeDelta,
  triggerPrice,
  triggerAboveThreshold,
  opts
) {
  const params = [index, collateralDelta, sizeDelta, triggerPrice, triggerAboveThreshold];
  const method = "updateDecreaseOrder";
  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, method, params, opts);
}

export async function updateIncreaseOrder(
  chainId,
  library,
  index,
  sizeDelta,
  triggerPrice,
  triggerAboveThreshold,
  opts
) {
  const params = [index, sizeDelta, triggerPrice, triggerAboveThreshold];
  const method = "updateIncreaseOrder";
  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, method, params, opts);
}

export async function updateSwapOrder(chainId, library, index, minOut, triggerRatio, triggerAboveThreshold, opts) {
  const params = [index, minOut, triggerRatio, triggerAboveThreshold];
  const method = "updateSwapOrder";
  const orderBookAddress = getContract(chainId, "OrderBook");
  const contract = new ethers.Contract(orderBookAddress, OrderBook.abi, library.getSigner());

  return callContract(chainId, contract, method, params, opts);
}

export async function _executeOrder(chainId, library, method, account, index, feeReceiver, opts) {
  const params = [account, index, feeReceiver];
  const positionManagerAddress = getContract(chainId, "PositionManager");
  const contract = new ethers.Contract(positionManagerAddress, PositionManager.abi, library.getSigner());
  return callContract(chainId, contract, method, params, opts);
}

export function executeSwapOrder(chainId, library, account, index, feeReceiver, opts) {
  return _executeOrder(chainId, library, "executeSwapOrder", account, index, feeReceiver, opts);
}

export function executeIncreaseOrder(chainId, library, account, index, feeReceiver, opts) {
  return _executeOrder(chainId, library, "executeIncreaseOrder", account, index, feeReceiver, opts);
}

export function executeDecreaseOrder(chainId, library, account, index, feeReceiver, opts) {
  return _executeOrder(chainId, library, "executeDecreaseOrder", account, index, feeReceiver, opts);
}
