import { ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, MAINNET, MODE_MAINNET } from "./chains";

export const LIQ_STATS_API_URL = {
  default: "https://stats.liq.markets/api",
  [MODE_MAINNET]: "https://stats.liq.markets/api",
};

const BACKEND_URLS = {
  default: "https://api.liq.markets",

  [MAINNET]: "https://gambit-server-staging.uc.r.appspot.com",
  [ARBITRUM_TESTNET]: "https://gambit-server-devnet.uc.r.appspot.com",
  [ARBITRUM]: "https://liq-server-mainnet.uw.r.appspot.com",
  [AVALANCHE]: "https://liq-avax-server.uc.r.appspot.com",
  [MODE_MAINNET]: "https://api.liq.markets",
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
