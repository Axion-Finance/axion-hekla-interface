import { ARBITRUM, AVALANCHE, MODE_MAINNET } from "./chains";

export const SUBGRAPH_URLS = {
  [ARBITRUM]: {
    stats: "https://api.thegraph.com/subgraphs/name/liq-io/liq-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/liq-io/liq-arbitrum-referrals",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/liq-vault",
  },

  [AVALANCHE]: {
    stats: "https://api.thegraph.com/subgraphs/name/liq-io/liq-avalanche-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/liq-io/liq-avalanche-referrals",
  },
  [MODE_MAINNET]: {
    stats: "https://api.goldsky.com/api/public/project_clrhmyxsvvuao01tu4aqj653e/subgraphs/liq-stats/1.0.0/gn",
    referrals: "https://api.goldsky.com/api/public/project_clrhmyxsvvuao01tu4aqj653e/subgraphs/liq-referrals/1.0.0/gn",
  },
  common: {
    chainLink: "https://api.thegraph.com/subgraphs/name/deividask/chainlink",
  },
};
