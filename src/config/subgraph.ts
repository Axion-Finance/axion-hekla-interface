import { ARBITRUM, AVALANCHE, TAIKO_MAINNET } from "./chains";

export const SUBGRAPH_URLS = {
  [ARBITRUM]: {
    stats: "https://api.thegraph.com/subgraphs/name/axion-io/axion-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/axion-io/axion-arbitrum-referrals",
    nissohVault: "https://api.thegraph.com/subgraphs/name/nissoh/axion-vault",
  },

  [AVALANCHE]: {
    stats: "https://api.thegraph.com/subgraphs/name/axion-io/axion-avalanche-stats",
    referrals: "https://api.thegraph.com/subgraphs/name/axion-io/axion-avalanche-referrals",
  },
  [TAIKO_MAINNET]: {
    stats: "https://api.goldsky.com/api/public/project_cm4jo31x7hs8y01xleg0l57xq/subgraphs/axion-stats/1.0.0/gn",
    referrals:
      "https://api.goldsky.com/api/public/project_cm4jo31x7hs8y01xleg0l57xq/subgraphs/axion-referrals/1.0.0/gn",
  },
  common: {
    chainLink: "https://api.thegraph.com/subgraphs/name/deividask/chainlink",
  },
};
