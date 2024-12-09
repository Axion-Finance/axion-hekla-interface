import { createClient } from "./utils";
import { SUBGRAPH_URLS } from "config/subgraph";
import { ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, TAIKO_MAINNET } from "config/chains";

export const chainlinkClient = createClient(SUBGRAPH_URLS.common.chainLink);

export const arbitrumGraphClient = createClient(SUBGRAPH_URLS[ARBITRUM].stats);
export const arbitrumReferralsGraphClient = createClient(SUBGRAPH_URLS[ARBITRUM].referrals);
export const nissohGraphClient = createClient(SUBGRAPH_URLS[ARBITRUM].nissohVault);

export const avalancheGraphClient = createClient(SUBGRAPH_URLS[AVALANCHE].stats);
export const avalancheReferralsGraphClient = createClient(SUBGRAPH_URLS[AVALANCHE].referrals);

export const modeTestnetGraphClient = createClient(SUBGRAPH_URLS[TAIKO_MAINNET].stats);
export const fantomReferralsGraphClient = createClient(SUBGRAPH_URLS[TAIKO_MAINNET].referrals);

export function getLiqGraphClient(chainId: number) {
  if (chainId === ARBITRUM) {
    return arbitrumGraphClient;
  } else if (chainId === AVALANCHE) {
    return avalancheGraphClient;
  } else if (chainId === TAIKO_MAINNET) {
    return modeTestnetGraphClient;
  } else if (chainId === ARBITRUM_TESTNET) {
    return null;
  }

  throw new Error(`Unsupported chain ${chainId}`);
}
