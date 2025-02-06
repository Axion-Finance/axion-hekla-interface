import { ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, MAINNET, TAIKO_MAINNET, TAIKO_TESTNET } from "./chains";

export const LIQ_STATS_API_URL = {
  default: "https://stats.axion.finance/api",
  [TAIKO_MAINNET]: "https://stats.axion.finance/api",
  [TAIKO_TESTNET]: "https://stats.axion.finance/api",
};

const BACKEND_URLS = {
  default: "https://api.axion.finance",

  [MAINNET]: "https://gambit-server-staging.uc.r.appspot.com",
  [ARBITRUM_TESTNET]: "https://gambit-server-devnet.uc.r.appspot.com",
  [ARBITRUM]: "https://axion-server-mainnet.uw.r.appspot.com",
  [AVALANCHE]: "https://axion-avax-server.uc.r.appspot.com",
  [TAIKO_MAINNET]: "https://api.axion.finance",
  [TAIKO_TESTNET]: "https://api.axion.finance",
};

export function getServerBaseUrl(chainId: number) {
  if (!chainId) {
    throw new Error("chainId is not provided");
  }

  if (document.location.hostname.includes("deploy-preview")) {
    const fromLocalStorage = localStorage.getItem("SERVER_BASE_URL");
    if (fromLocalStorage) {
      return fromLocalStorage;
    }
  }

  return BACKEND_URLS[chainId] || BACKEND_URLS.default;
}

export function getStatsServerBaseUrl(chainId: number) {
  if (!chainId) {
    throw new Error("chainId is not provided");
  }

  return LIQ_STATS_API_URL[chainId] || LIQ_STATS_API_URL.default;
}

export function getStatsAPIUrl(chainId: number, path: string) {
  return `${getStatsServerBaseUrl(chainId)}${path}`;
}
export function getServerUrl(chainId: number, path: string) {
  return `${getServerBaseUrl(chainId)}${path}`;
}
