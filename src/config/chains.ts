import { ethers } from "ethers";
import { isDevelopment } from "lib/legacy";
import { NetworkMetadata } from "lib/wallets";
import { sample } from "lodash";

const { parseEther } = ethers.utils;

export const MAINNET = 56;
export const ETH_MAINNET = 1;
export const AVALANCHE = 43114;
export const TESTNET = 97;
export const ARBITRUM_TESTNET = 421611;
export const ARBITRUM = 42161;
//export const KAVA = 2222;
export const MUMBAI = 80001;
export const TAIKO_MAINNET = 167000;
export const TAIKO_TESTNET = 167009;
// TODO take it from web3
export const DEFAULT_CHAIN_ID = TAIKO_MAINNET;
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const SUPPORTED_CHAIN_IDS = [TAIKO_MAINNET, TAIKO_TESTNET];

if (isDevelopment()) {
  SUPPORTED_CHAIN_IDS.push(ARBITRUM_TESTNET);
}

export const IS_NETWORK_DISABLED = {
  [TAIKO_MAINNET]: false,
  [AVALANCHE]: false,
  [TAIKO_TESTNET]: false,
};

export const CHAIN_NAMES_MAP = {
  [MAINNET]: "BSC",
  [TESTNET]: "BSC Testnet",
  [ARBITRUM_TESTNET]: "ArbRinkeby",
  [ARBITRUM]: "Arbitrum",
  [AVALANCHE]: "Avalanche",
  [TAIKO_MAINNET]: "Taiko",
  [TAIKO_TESTNET]: "Taiko Testnet",
};

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [ARBITRUM]: "0",
  [AVALANCHE]: "3000000000", // 3 gwei
  [TAIKO_MAINNET]: "0",
  [TAIKO_TESTNET]: "0",
};

export const MAX_GAS_PRICE_MAP = {
  [AVALANCHE]: "200000000000", // 200 gwei
  // [TAIKO_MAINNET]: "200000000000",
};

export const HIGH_EXECUTION_FEES_MAP = {
  [ARBITRUM]: 3, // 3 USD
  [AVALANCHE]: 3, // 3 USD
  [TAIKO_MAINNET]: 3,
  [TAIKO_TESTNET]: 3,
};

const constants = {
  [MAINNET]: {
    nativeTokenSymbol: "BNB",
    defaultCollateralSymbol: "BUSD",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 8,
    v2: false,
  },

  [TESTNET]: {
    nativeTokenSymbol: "BNB",
    defaultCollateralSymbol: "BUSD",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 8,
    v2: false,
  },

  [ARBITRUM_TESTNET]: {
    nativeTokenSymbol: "ETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },

  [ARBITRUM]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },

  [AVALANCHE]: {
    nativeTokenSymbol: "AVAX",
    wrappedTokenSymbol: "WAVAX",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.01"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0100001"),
  },
  [TAIKO_MAINNET]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.001001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.001001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0010001"),
  },
  [TAIKO_TESTNET]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: true,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.001001"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.001001"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0010001"),
  },
};

const ALCHEMY_WHITELISTED_DOMAINS = ["perp.testnet.axion.finance"];

export const ARBITRUM_RPC_PROVIDERS = [getDefaultArbitrumRpcUrl()];
export const AVALANCHE_RPC_PROVIDERS = ["https://api.avax.network/ext/bc/C/rpc"];
export const TAIKO_MAINNET_RPC_PROVIDERS = ["https://rpc.mainnet.taiko.xyz"];
export const TAIKO_TESTNET_RPC_PROVIDERS = ["https://rpc.hekla.taiko.xyz"];
// BSC TESTNET
// const RPC_PROVIDERS = [
//   "https://data-seed-prebsc-1-s1.binance.org:8545",
//   "https://data-seed-prebsc-2-s1.binance.org:8545",
//   "https://data-seed-prebsc-1-s2.binance.org:8545",
//   "https://data-seed-prebsc-2-s2.binance.org:8545",
//   "https://data-seed-prebsc-1-s3.binance.org:8545",
//   "https://data-seed-prebsc-2-s3.binance.org:8545"
// ]

// BSC MAINNET
export const BSC_RPC_PROVIDERS = [
  "https://bsc-dataseed.binance.org",
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed1.ninicoin.io",
  "https://bsc-dataseed2.defibit.io",
  "https://bsc-dataseed3.defibit.io",
  "https://bsc-dataseed4.defibit.io",
  "https://bsc-dataseed2.ninicoin.io",
  "https://bsc-dataseed3.ninicoin.io",
  "https://bsc-dataseed4.ninicoin.io",
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed2.binance.org",
  "https://bsc-dataseed3.binance.org",
  "https://bsc-dataseed4.binance.org",
];

export const ETH_MAINNET_PROVIDERS = ["https://rpc.ankr.com/eth"];

export const RPC_PROVIDERS = {
  [ETH_MAINNET]: ETH_MAINNET_PROVIDERS,
  [MAINNET]: BSC_RPC_PROVIDERS,
  [ARBITRUM]: ARBITRUM_RPC_PROVIDERS,
  [AVALANCHE]: AVALANCHE_RPC_PROVIDERS,
  [TAIKO_MAINNET]: TAIKO_MAINNET_RPC_PROVIDERS,
  [TAIKO_TESTNET]: TAIKO_TESTNET_RPC_PROVIDERS,
};

export const FALLBACK_PROVIDERS = {
  [TAIKO_MAINNET]: TAIKO_MAINNET_RPC_PROVIDERS,
  [ARBITRUM]: [getAlchemyHttpUrl()],
  [AVALANCHE]: ["https://avax-mainnet.gateway.pokt.network/v1/lb/626f37766c499d003aada23b"],
  [TAIKO_TESTNET]: TAIKO_TESTNET_RPC_PROVIDERS,
};

export const NETWORK_METADATA: { [chainId: number]: NetworkMetadata } = {
  [MAINNET]: {
    chainId: "0x" + MAINNET.toString(16),
    chainName: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: BSC_RPC_PROVIDERS,
    blockExplorerUrls: ["https://bscscan.com"],
  },
  [TESTNET]: {
    chainId: "0x" + TESTNET.toString(16),
    chainName: "BSC Testnet",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  },
  [ARBITRUM_TESTNET]: {
    chainId: "0x" + ARBITRUM_TESTNET.toString(16),
    chainName: "Arbitrum Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/"],
  },
  // [ARBITRUM]: {
  //   chainId: "0x" + ARBITRUM.toString(16),
  //   chainName: "Arbitrum",
  //   nativeCurrency: {
  //     name: "ETH",
  //     symbol: "ETH",
  //     decimals: 18,
  //   },
  //   rpcUrls: ARBITRUM_RPC_PROVIDERS,
  //   blockExplorerUrls: [getExplorerUrl(ARBITRUM)],
  // },
  // [AVALANCHE]: {
  //   chainId: "0x" + AVALANCHE.toString(16),
  //   chainName: "Avalanche",
  //   nativeCurrency: {
  //     name: "AVAX",
  //     symbol: "AVAX",
  //     decimals: 18,
  //   },
  //   rpcUrls: AVALANCHE_RPC_PROVIDERS,
  //   blockExplorerUrls: [getExplorerUrl(AVALANCHE)],
  // },
  [TAIKO_MAINNET]: {
    chainId: "0x" + TAIKO_MAINNET.toString(16),
    chainName: "Taiko Mainnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: TAIKO_MAINNET_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(TAIKO_MAINNET)],
  },
  [TAIKO_TESTNET]: {
    chainId: "0x" + TAIKO_TESTNET.toString(16),
    chainName: "Taiko Testnet",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: TAIKO_TESTNET_RPC_PROVIDERS,
    blockExplorerUrls: [getExplorerUrl(TAIKO_TESTNET)],
  },
};

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId]) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }

  if (!(key in constants[chainId])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`);
  }

  return constants[chainId][key];
};

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getDefaultArbitrumRpcUrl() {
  return "https://arb1.arbitrum.io/rpc";
}

export function getRpcUrl(chainId: number): string | undefined {
  return sample(RPC_PROVIDERS[chainId]);
}

export function getAlchemyHttpUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "https://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ";
  }
  return "https://arb-mainnet.g.alchemy.com/v2/EmVYwUw0N2tXOuG0SZfe5Z04rzBsCbr2";
}

export function getAlchemyWsUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "wss://arb-mainnet.g.alchemy.com/v2/ha7CFsr1bx5ZItuR6VZBbhKozcKDY4LZ";
  }
  return "wss://arb-mainnet.g.alchemy.com/v2/EmVYwUw0N2tXOuG0SZfe5Z04rzBsCbr2";
}

export function getExplorerUrl(chainId) {
  if (chainId === 3) {
    return "https://ropsten.etherscan.io/";
  } else if (chainId === 42) {
    return "https://kovan.etherscan.io/";
  } else if (chainId === MAINNET) {
    return "https://bscscan.com/";
  } else if (chainId === TESTNET) {
    return "https://testnet.bscscan.com/";
  } else if (chainId === ARBITRUM_TESTNET) {
    return "https://testnet.arbiscan.io/";
  } else if (chainId === ARBITRUM) {
    return "https://arbiscan.io/";
  } else if (chainId === AVALANCHE) {
    return "https://snowtrace.io/";
  } else if (chainId === TAIKO_MAINNET) {
    return "https://taikoscan.io/";
  } else if (chainId === TAIKO_TESTNET) {
    return "https://hekla.taikoexplorer.com/";
  }
  return "https://etherscan.io/";
}

export function getHighExecutionFee(chainId) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3;
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}
