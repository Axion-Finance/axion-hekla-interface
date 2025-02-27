import { Token } from "domain/tokens";
import { ethers } from "ethers";
import {
  ARBITRUM,
  ARBITRUM_TESTNET,
  AVALANCHE,
  MAINNET,
  MUMBAI,
  TAIKO_MAINNET,
  TAIKO_TESTNET,
  TESTNET,
} from "./chains";
import { getContract } from "./contracts";

export const TOKENS: { [chainId: number]: Token[] } = {
  [MAINNET]: [
    {
      name: "Bitcoin (BTCB)",
      symbol: "BTC",
      decimals: 18,
      address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      coingeckoUrl: "https://www.coingecko.com/en/coins/binance-bitcoin",
      imageUrl: "https://assets.coingecko.com/coins/images/14108/small/Binance-bitcoin.png",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      coingeckoUrl: "https://www.coingecko.com/en/coins/ethereum",
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
    },
    {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
      address: ethers.constants.AddressZero,
      coingeckoUrl: "https://www.coingecko.com/en/coins/binance-coin",
      imageUrl: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png",
      isNative: true,
    },
    {
      name: "Wrapped Binance Coin",
      symbol: "WBNB",
      decimals: 18,
      address: getContract(MAINNET, "NATIVE_TOKEN"),
      isWrapped: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/binance-coin",
      imageUrl: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png",
      baseSymbol: "BNB",
    },
    {
      name: "USD Gambit",
      symbol: "USDG",
      decimals: 18,
      address: getContract(MAINNET, "USDG"),
      isUsdg: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-gambit",
      imageUrl: "https://assets.coingecko.com/coins/images/15886/small/usdg-02.png",
    },
    {
      name: "Binance USD",
      symbol: "BUSD",
      decimals: 18,
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      isStable: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/binance-usd",
      imageUrl: "https://assets.coingecko.com/coins/images/9576/small/BUSD.png",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 18,
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      isStable: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/usd-coin",
      imageUrl: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png",
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 18,
      address: "0x55d398326f99059fF775485246999027B3197955",
      isStable: true,
      coingeckoUrl: "https://www.coingecko.com/en/coins/tether",
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
    },
  ],
  [TESTNET]: [
    {
      name: "Bitcoin (BTCB)",
      symbol: "BTC",
      decimals: 8,
      address: "0xb19C12715134bee7c4b1Ca593ee9E430dABe7b56",
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: "0x1958f7C067226c7C8Ac310Dc994D0cebAbfb2B02",
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      imageUrl: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png",
    },
    {
      name: "Wrapped Binance Coin",
      symbol: "WBNB",
      decimals: 18,
      address: "0x612777Eea37a44F7a95E3B101C39e1E2695fa6C2",
      isWrapped: true,
      baseSymbol: "BNB",
      imageUrl: "https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png",
    },
    {
      name: "USD Gambit",
      symbol: "USDG",
      decimals: 18,
      address: getContract(TESTNET, "USDG"),
      isUsdg: true,
      imageUrl: "https://assets.coingecko.com/coins/images/15886/small/usdg-02.png",
    },
    {
      name: "Binance USD",
      symbol: "BUSD",
      decimals: 18,
      address: "0x3F223C4E5ac67099CB695834b20cCd5E5D5AA9Ef",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/9576/small/BUSD.png",
    },
  ],
  [ARBITRUM_TESTNET]: [
    {
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 8,
      address: "0x27960f9A322BE96A1535E6c19B3958e80E6a2670",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    // https://github.com/OffchainLabs/arbitrum/blob/950c2f91b2e951cd3764394e0a73eac3797aecf3/packages/arb-ts/src/lib/networks.ts#L65
    {
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      address: "0xB47e6A5f8b33b3F17603C83a0535A9dcD7E32681",
      isWrapped: true,
      baseSymbol: "ETH",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xf0DCd4737A20ED33481A49De94C599944a3Ca737",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0x818ED84bA1927945b631016e0d402Db50cE8865f",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
    },
  ],
  [ARBITRUM]: [
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    {
      name: "Wrapped Ethereum",
      symbol: "WETH",
      decimals: 18,
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      isWrapped: true,
      baseSymbol: "ETH",
      imageUrl: "https://assets.coingecko.com/coins/images/2518/thumb/weth.png?1628852295",
    },
    {
      name: "Bitcoin (WBTC)",
      symbol: "BTC",
      decimals: 8,
      address: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    },
    {
      name: "Chainlink",
      symbol: "LINK",
      decimals: 18,
      address: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
      isStable: false,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700",
    },
    {
      name: "Uniswap",
      symbol: "UNI",
      decimals: 18,
      address: "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0",
      isStable: false,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/12504/thumb/uniswap-uni.png?1600306604",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707",
    },
    {
      name: "Dai",
      symbol: "DAI",
      decimals: 18,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/9956/thumb/4943.png?1636636734",
    },
    {
      name: "Frax",
      symbol: "FRAX",
      decimals: 18,
      address: "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F",
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/13422/small/frax_logo.png?1608476506",
    },
    {
      name: "Magic Internet Money",
      symbol: "MIM",
      decimals: 18,
      address: "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A",
      isStable: true,
      isTempHidden: true,
      imageUrl: "https://assets.coingecko.com/coins/images/16786/small/mimlogopng.png",
    },
  ],
  [AVALANCHE]: [
    {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    },
    {
      name: "Wrapped AVAX",
      symbol: "WAVAX",
      decimals: 18,
      address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      isWrapped: true,
      baseSymbol: "AVAX",
      imageUrl: "https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png?1604021818",
    },
    {
      name: "Ethereum (WETH.e)",
      symbol: "ETH",
      address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    {
      name: "Bitcoin (BTC.b)",
      symbol: "BTC",
      address: "0x152b9d0FdC40C096757F570A51E494bd4b943E50",
      decimals: 8,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "Bitcoin (WBTC.e)",
      symbol: "WBTC",
      address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
      decimals: 8,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/7598/thumb/wrapped_bitcoin_wbtc.png?1548822744",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      name: "USD Coin (USDC.e)",
      symbol: "USDC.e",
      address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      name: "Magic Internet Money",
      symbol: "MIM",
      address: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      decimals: 18,
      isStable: true,
      isTempHidden: true,
      imageUrl: "https://assets.coingecko.com/coins/images/16786/small/mimlogopng.png",
    },
  ],
  // [KAVA]: [
  //   {
  //     name: "KAVA",
  //     symbol: "KAVA",
  //     decimals: 18,
  //     displayDecimals: 3,
  //     address: ethers.constants.AddressZero,
  //     isNative: true,
  //     isShortable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png?1669652346",
  //   },
  //   {
  //     name: "Wrapped Kava",
  //     symbol: "WKAVA",
  //     decimals: 18,
  //     displayDecimals: 3,
  //     address: "0xc86c7C0eFbd6A49B35E8714C5f59D99De09A225b",
  //     isWrapped: true,
  //     baseSymbol: "KAVA",
  //     imageUrl: "https://ftmscan.com/token/images/wFtm_32.png",
  //   },
  //   {
  //     name: "Ethereum",
  //     symbol: "ETH",
  //     address: "0xE3F5a90F9cb311505cd691a46596599aA1A0AD7D",
  //     decimals: 18,
  //     isShortable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
  //   },
  //   {
  //     name: "Bitcoin",
  //     symbol: "BTC",
  //     address: "0x818ec0A7Fe18Ff94269904fCED6AE3DaE6d6dC0b",
  //     decimals: 8,
  //     isShortable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
  //   },
  //   {
  //     name: "USD Coin",
  //     symbol: "USDC",
  //     address: "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f",
  //     decimals: 6,
  //     isStable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
  //   },
  //   {
  //     name: "Tether",
  //     symbol: "USDT",
  //     address: "0xB44a9B6905aF7c801311e8F4E76932ee959c663C",
  //     decimals: 6,
  //     isStable: true,
  //     imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
  //   }
  // ],
  //
  [TAIKO_MAINNET]: [
    {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      displayDecimals: 3,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png?1669652346",
    },
    {
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      displayDecimals: 3,
      address: "0xA51894664A773981C6C112C43ce576f315d5b1B6",
      isWrapped: true,
      baseSymbol: "WETH",
      imageUrl: "https://ftmscan.com/token/images/wFtm_32.png",
    },
    {
      name: "Taiko Token",
      symbol: "TAIKO",
      address: "0xA9d23408b9bA935c230493c40C73824Df71A0975",
      decimals: 18,
      displayDecimals: 2,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x07d83526730c7438048d55a4fc0b850e2aab6f0b",
      decimals: 6,
      displayDecimals: 2,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      name: "Tether",
      symbol: "USDT",
      address: "0x2def195713cf4a606b49d07e520e22c17899a736",
      decimals: 6,
      displayDecimals: 2,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
    },
  ],
  [TAIKO_TESTNET]: [
    {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      displayDecimals: 3,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png?1669652346",
    },
    {
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      displayDecimals: 3,
      address: "0x4cb55c4C3b0ec4E2AC20Ee90afeF7A32c1f56D64",
      isWrapped: true,
      baseSymbol: "WETH",
      imageUrl: "https://ftmscan.com/token/images/wFtm_32.png",
    },
    // {
    //   name: "Taiko Token",
    //   symbol: "TAIKO",
    //   address: "0xA9d23408b9bA935c230493c40C73824Df71A0975",
    //   decimals: 18,
    //   displayDecimals: 2,
    //   isShortable: true,
    //   imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
    // },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x6699b71295c0549Fd95FE67B62Cc43D3B11b368F",
      decimals: 6,
      displayDecimals: 2,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      name: "Tether",
      symbol: "USDT",
      address: "0x0358E1AEfeD84Eec337fa58Febb15D3C205486b9",
      decimals: 6,
      displayDecimals: 2,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
    },
  ],
  [MUMBAI]: [
    {
      name: "FTM",
      symbol: "FTM",
      decimals: 18,
      displayDecimals: 3,
      address: ethers.constants.AddressZero,
      isNative: true,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png?1669652346",
    },
    {
      name: "Wrapped FTM",
      symbol: "WFTM",
      decimals: 18,
      displayDecimals: 3,
      address: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
      isWrapped: true,
      baseSymbol: "FTM",
      imageUrl: "https://ftmscan.com/token/images/wFtm_32.png",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      address: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
      decimals: 18,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      address: "0x321162Cd933E2Be498Cd2267a90534A804051b11",
      decimals: 8,
      isShortable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/26115/thumb/btcb.png?1655921693",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389",
    },
    {
      name: "Tether",
      symbol: "USDT",
      address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
      decimals: 6,
      isStable: true,
      imageUrl: "https://assets.coingecko.com/coins/images/325/small/Tether-logo.png",
    },
    {
      name: "DAI",
      symbol: "DAI",
      decimals: 18,
      address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
      isStable: true,
      imageUrl: "https://optimistic.etherscan.io/token/images/MCDDai_32.png",
    },
  ],
};

export const ADDITIONAL_TOKENS: { [chainId: number]: Token[] } = {
  [ARBITRUM]: [
    {
      name: "AXION",
      symbol: "AXION",
      address: getContract(ARBITRUM, "AXION"),
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    {
      name: "Escrowed LIQLIQ",
      symbol: "esLIQ",
      address: getContract(ARBITRUM, "ES_LIQ"),
      decimals: 18,
    },
    {
      name: "Axion LP",
      symbol: "LLP",
      address: getContract(ARBITRUM, "LLP"),
      decimals: 18,
      imageUrl: "https://github.com/axion-io/axion-assets/blob/main/AXION-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  ],
  [AVALANCHE]: [
    {
      name: "AXION",
      symbol: "AXION",
      address: getContract(AVALANCHE, "AXION"),
      decimals: 18,
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    {
      name: "Escrowed LIQLIQ",
      symbol: "esLIQ",
      address: getContract(AVALANCHE, "ES_LIQ"),
      decimals: 18,
    },
    {
      name: "Axion LP",
      symbol: "LLP",
      address: getContract(ARBITRUM, "LLP"),
      decimals: 18,
      imageUrl: "https://github.com/axion-io/axion-assets/blob/main/AXION-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  ],
  // [KAVA]: [
  //   {
  //     name: "AXION",
  //     symbol: "AXION",
  //     address: getContract(KAVA, "AXION"),
  //     decimals: 18,
  //     imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
  //   },
  //   {
  //     name: "Escrowed LIQLIQ",
  //     symbol: "esLIQ",
  //     address: getContract(KAVA, "ES_LIQ"),
  //     decimals: 18,
  //   },
  //   {
  //     name: "Axion LP",
  //     symbol: "LLP",
  //     address: getContract(KAVA, "LLP"),
  //     decimals: 18,
  //     imageUrl: "https://github.com/axion-io/axion-assets/blob/main/AXION-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
  //   },
  // ],
  [TAIKO_MAINNET]: [
    // {
    //   name: "AXION",
    //   symbol: "AXION",
    //   address: getContract(TAIKO_MAINNET, "AXION"),
    //   decimals: 18,
    //   imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    // },
    // {
    //   name: "Escrowed LIQLIQ",
    //   symbol: "esLIQ",
    //   address: getContract(TAIKO_MAINNET, "ES_LIQ"),
    //   decimals: 18,
    // },
    // {
    //   name: "Axion LP",
    //   symbol: "LLP",
    //   address: getContract(TAIKO_MAINNET, "LLP"),
    //   decimals: 18,
    //   imageUrl: "https://github.com/axion-io/axion-assets/blob/main/AXION-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    // },
  ],
  [TAIKO_TESTNET]: [],
};

export const PLATFORM_TOKENS: { [chainId: number]: { [symbol: string]: Token } } = {
  [ARBITRUM]: {
    // arbitrum
    AXION: {
      name: "AXION",
      symbol: "AXION",
      decimals: 18,
      address: getContract(ARBITRUM, "AXION"),
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    GLP: {
      name: "Axion LP",
      symbol: "LLP",
      decimals: 18,
      address: getContract(ARBITRUM, "StakedLlpTracker"), // address of fsGLP token because user only holds fsGLP
      imageUrl: "https://github.com/axion-io/axion-assets/blob/main/AXION-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  },
  [AVALANCHE]: {
    // avalanche
    AXION: {
      name: "AXION",
      symbol: "AXION",
      decimals: 18,
      address: getContract(AVALANCHE, "AXION"),
      imageUrl: "https://assets.coingecko.com/coins/images/18323/small/arbit.png?1631532468",
    },
    GLP: {
      name: "Axion LP",
      symbol: "LLP",
      decimals: 18,
      address: getContract(AVALANCHE, "StakedLlpTracker"), // address of fsGLP token because user only holds fsGLP
      imageUrl: "https://github.com/axion-io/axion-assets/blob/main/AXION-Assets/PNG/GLP_LOGO%20ONLY.png?raw=true",
    },
  },
  // [KAVA]: {
  //   // avalanche
  //   AXION: {
  //     name: "LIQLIQ",
  //     symbol: "LIQLIQ",
  //     decimals: 18,
  //     address: getContract(KAVA, "AXION"),
  //     imageUrl: "https://assets.coingecko.com/coins/images/28547/small/Logo_KMX.png?1671599329",
  //   },
  //   GLP: {
  //     name: "KMX LP",
  //     symbol: "KLP",
  //     decimals: 18,
  //     address: getContract(KAVA, "StakedLlpTracker"), // address of fsGLP token because user only holds fsGLP
  //   },
  // },
  [TAIKO_MAINNET]: {
    AXION: {
      name: "AXION",
      symbol: "AXION",
      decimals: 18,
      address: getContract(TAIKO_MAINNET, "AXION"),
      imageUrl: "https://assets.coingecko.com/coins/images/28547/small/Logo_LIQ.png?1671599329",
    },
    GLP: {
      name: "LIQ_LP",
      symbol: "LLP",
      decimals: 18,
      address: getContract(TAIKO_MAINNET, "FeeLlpTracker"), // address of fsGLP token because user only holds fsGLP
    },
  },
};

export const ICONLINKS = {
  [ARBITRUM_TESTNET]: {
    AXION: {
      coingecko: "https://www.coingecko.com/en/coins/axion",
      arbitrum: "https://arbiscan.io/address/0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
    },
    GLP: {
      arbitrum: "https://testnet.arbiscan.io/token/0xb4f81Fa74e06b5f762A104e47276BA9b2929cb27",
    },
  },
  // [KAVA]: {
  //   AXION: {
  //     coingecko: "https://www.coingecko.com/en/coins/mummy-markets",
  //     fantom: "https://ftmscan.com/address/0x9CB7beAEcdE90a682BDb86AaA32EF032bD9e4079",
  //   },
  //   GLP: {
  //     fantom: "https://ftmscan.com/token/0xcf4D627f1bb9aB2deC8Ec4c928686b2b4165Ec73",
  //   },
  //   ETH: {
  //     coingecko: "https://www.coingecko.com/en/coins/ethereum",
  //   },
  //   BTC: {
  //     coingecko: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
  //     fantom: "https://ftmscan.com/address/0x321162cd933e2be498cd2267a90534a804051b11",
  //   },
  //   LINK: {
  //     coingecko: "https://www.coingecko.com/en/coins/chainlink",
  //     fantom: "https://ftmscan.com/address/0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
  //   },
  //   USDC: {
  //     coingecko: "https://www.coingecko.com/en/coins/usd-coin",
  //     fantom: "https://ftmscan.com/address/0x04068da6c83afcfa0e13ba15a6696662335d5b75",
  //   },
  //   USDT: {
  //     coingecko: "https://www.coingecko.com/en/coins/tether",
  //     fantom: "https://ftmscan.com/address/0x049d68029688eabf473097a2fc38ef61633a3c7a",
  //   },
  //   DAI: {
  //     coingecko: "https://www.coingecko.com/en/coins/dai",
  //     fantom: "https://ftmscan.com/address/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
  //   },
  //   FTM: {
  //     coingecko: "https://www.coingecko.com/en/coins/fantom",
  //     fantom: "https://ftmscan.com/address/0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
  //   },
  // },
  [TAIKO_MAINNET]: {
    AXION: {
      coingecko: "https://www.coingecko.com/en/coins/mummy-markets",
      fantom: "https://ftmscan.com/address/0x9CB7beAEcdE90a682BDb86AaA32EF032bD9e4079",
    },
    TAIKO: {
      fantom: "https://ftmscan.com/token/0xcf4D627f1bb9aB2deC8Ec4c928686b2b4165Ec73",
    },
    ETH: {
      coingecko: "https://www.coingecko.com/en/coins/ethereum",
    },
    BTC: {
      coingecko: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      fantom: "https://ftmscan.com/address/0x321162cd933e2be498cd2267a90534a804051b11",
    },
    LINK: {
      coingecko: "https://www.coingecko.com/en/coins/chainlink",
      fantom: "https://ftmscan.com/address/0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
    },
    USDC: {
      coingecko: "https://www.coingecko.com/en/coins/usd-coin",
      fantom: "https://ftmscan.com/address/0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    },
    USDT: {
      coingecko: "https://www.coingecko.com/en/coins/tether",
      fantom: "https://ftmscan.com/address/0x049d68029688eabf473097a2fc38ef61633a3c7a",
    },
    DAI: {
      coingecko: "https://www.coingecko.com/en/coins/dai",
      fantom: "https://ftmscan.com/address/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
  },
  [ARBITRUM]: {
    AXION: {
      coingecko: "https://www.coingecko.com/en/coins/axion",
      arbitrum: "https://arbiscan.io/address/0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a",
    },
    GLP: {
      arbitrum: "https://arbiscan.io/token/0x1aDDD80E6039594eE970E5872D247bf0414C8903",
      reserves: "https://arbiscan.io/address/0x489ee077994b6658eafa855c308275ead8097c4a",
    },
    ETH: {
      coingecko: "https://www.coingecko.com/en/coins/ethereum",
    },
    BTC: {
      coingecko: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      arbitrum: "https://arbiscan.io/address/0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
    },
    LINK: {
      coingecko: "https://www.coingecko.com/en/coins/chainlink",
      arbitrum: "https://arbiscan.io/address/0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
    },
    UNI: {
      coingecko: "https://www.coingecko.com/en/coins/uniswap",
      arbitrum: "https://arbiscan.io/address/0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0",
    },
    USDC: {
      coingecko: "https://www.coingecko.com/en/coins/usd-coin",
      arbitrum: "https://arbiscan.io/address/0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
    },
    USDT: {
      coingecko: "https://www.coingecko.com/en/coins/tether",
      arbitrum: "https://arbiscan.io/address/0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
    DAI: {
      coingecko: "https://www.coingecko.com/en/coins/dai",
      arbitrum: "https://arbiscan.io/address/0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
    },
    MIM: {
      coingecko: "https://www.coingecko.com/en/coins/magic-internet-money",
      arbitrum: "https://arbiscan.io/address/0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a",
    },
    FRAX: {
      coingecko: "https://www.coingecko.com/en/coins/frax",
      arbitrum: "https://arbiscan.io/address/0x17fc002b466eec40dae837fc4be5c67993ddbd6f",
    },
  },
  [AVALANCHE]: {
    AXION: {
      coingecko: "https://www.coingecko.com/en/coins/axion",
      avalanche: "https://snowtrace.io/address/0x62edc0692bd897d2295872a9ffcac5425011c661",
    },
    GLP: {
      avalanche: "https://snowtrace.io/address/0x9e295B5B976a184B14aD8cd72413aD846C299660",
      reserves: "https://core.app/account/0x9ab2De34A33fB459b538c43f251eB825645e8595",
    },
    AVAX: {
      coingecko: "https://www.coingecko.com/en/coins/avalanche",
    },
    ETH: {
      coingecko: "https://www.coingecko.com/en/coins/weth",
      avalanche: "https://snowtrace.io/address/0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
    },
    WBTC: {
      coingecko: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      avalanche: "https://snowtrace.io/address/0x50b7545627a5162f82a992c33b87adc75187b218",
    },
    BTC: {
      coingecko: "https://www.coingecko.com/en/coins/bitcoin-avalanche-bridged-btc-b",
      avalanche: "https://snowtrace.io/address/0x152b9d0FdC40C096757F570A51E494bd4b943E50",
    },
    MIM: {
      coingecko: "https://www.coingecko.com/en/coins/magic-internet-money",
      avalanche: "https://snowtrace.io/address/0x130966628846bfd36ff31a822705796e8cb8c18d",
    },
    USDC: {
      coingecko: "https://www.coingecko.com/en/coins/usd-coin",
      avalanche: "https://snowtrace.io/address/0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e",
    },
    "USDC.e": {
      coingecko: "https://www.coingecko.com/en/coins/usd-coin-avalanche-bridged-usdc-e",
      avalanche: "https://snowtrace.io/address/0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664",
    },
  },
  [TAIKO_TESTNET]: {
    ETH: {
      coingecko: "https://www.coingecko.com/en/coins/ethereum",
    },
    BTC: {
      coingecko: "https://www.coingecko.com/en/coins/wrapped-bitcoin",
      fantom: "https://ftmscan.com/address/0xA3F4CFDEd079C16BC6390E3bE9CF94771123d4B2",
    },
    USDC: {
      coingecko: "https://www.coingecko.com/en/coins/usd-coin",
      fantom: "https://ftmscan.com/address/0x6699b71295c0549Fd95FE67B62Cc43D3B11b368F",
    },
    USDT: {
      coingecko: "https://www.coingecko.com/en/coins/tether",
      fantom: "https://ftmscan.com/address/0x0358E1AEfeD84Eec337fa58Febb15D3C205486b9",
    },
  },
};

export const GLP_POOL_COLORS = {
  ETH: "#6062a6",
  BTC: "#F7931A",
  WBTC: "#F7931A",
  USDC: "#2775CA",
  "USDC.e": "#2A5ADA",
  USDT: "#67B18A",
  MIM: "#9695F8",
  FRAX: "#000",
  DAI: "#FAC044",
  UNI: "#E9167C",
  AVAX: "#E84142",
  FTM: "#E84142",
  LINK: "#3256D6",
};

export const TOKENS_MAP: { [chainId: number]: { [address: string]: Token } } = {};
export const TOKENS_BY_SYMBOL_MAP: { [chainId: number]: { [symbol: string]: Token } } = {};
export const WRAPPED_TOKENS_MAP: { [chainId: number]: Token } = {};
export const NATIVE_TOKENS_MAP: { [chainId: number]: Token } = {};

const CHAIN_IDS = [MAINNET, TESTNET, ARBITRUM, ARBITRUM_TESTNET, AVALANCHE, TAIKO_MAINNET, TAIKO_TESTNET];

for (let j = 0; j < CHAIN_IDS.length; j++) {
  const chainId = CHAIN_IDS[j];
  TOKENS_MAP[chainId] = {};
  TOKENS_BY_SYMBOL_MAP[chainId] = {};
  let tokens = TOKENS[chainId];
  if (ADDITIONAL_TOKENS[chainId]) {
    tokens = tokens.concat(ADDITIONAL_TOKENS[chainId]);
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    TOKENS_MAP[chainId][token.address] = token;
    TOKENS_BY_SYMBOL_MAP[chainId][token.symbol] = token;
  }
}

for (const chainId of CHAIN_IDS) {
  for (const token of TOKENS[chainId]) {
    if (token.isWrapped) {
      WRAPPED_TOKENS_MAP[chainId] = token;
    } else if (token.isNative) {
      NATIVE_TOKENS_MAP[chainId] = token;
    }
  }
}

export function getWrappedToken(chainId: number) {
  return WRAPPED_TOKENS_MAP[chainId];
}

export function getNativeToken(chainId: number) {
  return NATIVE_TOKENS_MAP[chainId];
}

export function getTokens(chainId: number) {
  return TOKENS[chainId];
}

export function isValidToken(chainId: number, address: string) {
  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  return address in TOKENS_MAP[chainId];
}

export function getToken(chainId: number, address: string) {
  if (!TOKENS_MAP[chainId]) {
    throw new Error(`Incorrect chainId ${chainId}`);
  }
  // console.log("TOKENS_MAP[chainId][address] : ", TOKENS_MAP, address);
  if (!TOKENS_MAP[chainId][address]) {
    throw new Error(`Incorrect address "${address}" for chainId ${chainId}`);
  }
  return TOKENS_MAP[chainId][address];
}

export function getTokenBySymbol(chainId: number, symbol: string) {
  const token = TOKENS_BY_SYMBOL_MAP[chainId][symbol];
  if (!token) {
    throw new Error(`Incorrect symbol "${symbol}" for chainId ${chainId}`);
  }
  return token;
}

export function getWhitelistedTokens(chainId: number) {
  return TOKENS[chainId].filter((token) => token.symbol !== "USDG");
}

export function getVisibleTokens(chainId: number) {
  return getWhitelistedTokens(chainId).filter((token) => !token.isWrapped && !token.isTempHidden);
}

export function isChartAvailabeForToken(chainId: number, tokenSymbol: string) {
  let token;

  try {
    token = getTokenBySymbol(chainId, tokenSymbol);
  } catch (e) {
    return false;
  }

  if (token.isChartDisabled || token.isPlatformToken) return false;

  return true;
}

export function getPriceDecimals(chainId: number, tokenSymbol?: string) {
  if (!tokenSymbol) return 2;

  try {
    const token = getTokenBySymbol(chainId, tokenSymbol);
    return token.displayDecimals ?? 2;
  } catch (e) {
    return 2;
  }
}
