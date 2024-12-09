import { Trans } from "@lingui/macro";
import SEO from "components/Common/SEO";

import { getPageTitle } from "lib/legacy";

import arbitrumIcon from "img/ic_arbitrum_16.svg";
import avalancheIcon from "img/ic_avalanche_16.svg";

import { t } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { ARBITRUM, AVALANCHE } from "config/chains";
import "./Ecosystem.css";

const NETWORK_ICONS = {
  [ARBITRUM]: arbitrumIcon,
  [AVALANCHE]: avalancheIcon,
};

const NETWORK_ICON_ALTS = {
  [ARBITRUM]: "Arbitrum Icon",
  [AVALANCHE]: "Avalanche Icon",
};

export default function Ecosystem() {
  const liqPages = [
    {
      title: "Axion Governance",
      link: "https://gov.axion.io/",
      linkLabel: "gov.axion.io",
      about: t`Axion Governance Page`,
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Stats",
      link: "https://axion.markets/",
      linkLabel: "stats.axion.markets",
      about: t`Axion Stats Page`,
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Proposals",
      link: "https://snapshot.org/#/axion.eth",
      linkLabel: "snapshot.org",
      about: t`Axion Proposals Voting page`,
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Announcements",
      link: "https://t.me/LIQ_Announcements",
      linkLabel: "t.me",
      about: t`Axion Announcements and Updates`,
      chainIds: [ARBITRUM, AVALANCHE],
    },
  ];

  const communityProjects = [
    {
      title: "Axion Blueberry Club",
      link: "https://www.blueberry.club/",
      linkLabel: "blueberry.club",
      about: t`Axion Blueberry NFTs`,
      creatorLabel: "@xm92boi",
      creatorLink: "https://t.me/xm92boi",
      chainIds: [ARBITRUM],
    },
    {
      title: "Axion Leaderboard",
      link: "https://www.axion.house/",
      linkLabel: "axion.house",
      about: t`Leaderboard for Axion traders`,
      creatorLabel: "@Itburnz",
      creatorLink: "https://t.me/Itburnz",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Positions Bot",
      link: "https://t.me/LIQPositions",
      linkLabel: "t.me",
      about: t`Telegram bot for Axion position updates`,
      creatorLabel: "@zhongfu",
      creatorLink: "https://t.me/zhongfu",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Blueberry Pulse",
      link: "https://blueberrypulse.substack.com/",
      linkLabel: "substack.com",
      about: t`Axion Weekly Updates`,
      creatorLabel: "@puroscohiba",
      creatorLink: "https://t.me/puroscohiba",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "DegenClip",
      link: "https://degenclip.com/axion",
      linkLabel: "degenclip.com",
      about: t`Community curated tweet collection`,
      creatorLabel: "@ox21l",
      creatorLink: "https://t.me/ox21l",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Yield Simulator",
      link: "https://axion.defisims.com/",
      linkLabel: "defisims.com",
      about: t`Yield simulator for Axion`,
      creatorLabel: "@kyzoeth",
      creatorLink: "https://twitter.com/kyzoeth",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Returns Calculator",
      link: "https://docs.google.com/spreadsheets/u/4/d/1mQZlztz_NpTg5qQiYIzc_Ls1OTLfMOUtmEQN-WW8jj4/copy",
      linkLabel: "docs.google.com",
      about: t`Returns calculator for LIQLIQ and LLP`,
      creatorLabel: "@AStoicTrader1",
      creatorLink: "https://twitter.com/AStoicTrader1",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Compound Calculator",
      link: "https://docs.google.com/spreadsheets/d/14DiIE1wZkK9-Y5xSx1PzIgmpcj4ccz1YVw5nwzIWLgI/edit#gid=0",
      linkLabel: "docs.google.com",
      about: t`Optimal compound interval calculator`,
      creatorLabel: "@ChasenKaminsky",
      creatorLink: "https://twitter.com/ChasenKaminsky",
      chainIds: [AVALANCHE],
    },
    {
      title: "Axion Trading Stats",
      link: "https://t.me/LIQTradingStats",
      linkLabel: "t.me",
      about: t`Telegram bot for Open Interest on Axion`,
      creatorLabel: "@SniperMonke01",
      creatorLink: "https://twitter.com/SniperMonke01",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Staking Bot",
      link: "https://t.me/LIQ_Staking_bot",
      linkLabel: "t.me",
      about: t`Axion staking rewards updates and insights`,
      creatorLabel: "@LIQ_Staking_bot",
      creatorLink: "https://twitter.com/LIQ_Staking_bot",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Staking Calculator",
      link: "https://liqstaking.com",
      linkLabel: "liqstaking.com",
      about: t`Axion staking calculator`,
      creatorLabel: "@n1njawtf",
      creatorLink: "https://t.me/n1njawtf",
      chainIds: [ARBITRUM, AVALANCHE],
    },
  ];

  const dashboardProjects = [
    {
      title: "Axion Referrals Dashboard",
      link: "https://www.liqreferrals.com/",
      linkLabel: "liqreferrals.com",
      about: t`Dashboard for Axion referral stats`,
      creatorLabel: "@kyzoeth",
      creatorLink: "https://twitter.com/kyzoeth",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Axion Terminal",
      link: "https://liqterminal.com",
      linkLabel: "liqterminal.com",
      about: t`Axion explorer for stats and traders`,
      creatorLabel: "@vipineth",
      creatorLink: "https://t.me/vipineth",
      chainIds: [ARBITRUM],
    },
    {
      title: "Axion Analytics",
      link: "https://liqstats.com/",
      linkLabel: "liqstats.com",
      about: t`Financial reports and protocol analytics`,
      creatorLabel: "@CryptoMessiah",
      creatorLink: "https://t.me/LarpCapital",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "TokenTerminal",
      link: "https://tokenterminal.com/terminal/projects/axion",
      linkLabel: "tokenterminal.com",
      about: t`Axion fundamentals`,
      creatorLabel: "@tokenterminal",
      creatorLink: "https://twitter.com/tokenterminal",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "CryptoFees",
      link: "https://cryptofees.info",
      linkLabel: "cryptofees.info",
      about: t`Fees generated by Axion`,
      creatorLabel: "@CryptoFeesInfo",
      creatorLink: "https://twitter.com/CryptoFeesInfo",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Shogun Dashboard (Dune Arbitrum)",
      link: "https://dune.com/shogun/axion-analytics-arbitrum",
      linkLabel: "dune.com",
      about: t`Protocol analytics`,
      creatorLabel: "@JamesCliffyz",
      creatorLink: "https://twitter.com/JamesCliffyz",
      chainIds: [ARBITRUM],
    },
    {
      title: "Shogun Dashboard (Dune Avalanche)",
      link: "https://dune.com/shogun/axion-analytics-avalanche",
      linkLabel: "dune.com",
      about: t`Protocol analytics`,
      creatorLabel: "@JamesCliffyz",
      creatorLink: "https://twitter.com/JamesCliffyz",
      chainIds: [AVALANCHE],
    },
    {
      title: "Axion Perpetuals Data",
      link: "https://app.laevitas.ch/altsderivs/Axion/perpetualswaps",
      linkLabel: "laevitas.ch",
      about: t`Axion Perpetuals Data`,
      creatorLabel: "@laevitas1",
      creatorLink: "https://twitter.com/laevitas1",
      chainIds: [ARBITRUM],
    },
    {
      title: "Axion Blueberry Leaderboard",
      link: "https://www.blueberryboard.com",
      linkLabel: "blueberryboard.com",
      about: t`GBC NFTs APR tracker and rewards`,
      creatorLabel: "@kyzoeth",
      creatorLink: "https://twitter.com/kyzoeth",
      chainIds: [ARBITRUM],
    },
  ];

  const integrations = [
    {
      title: "DeBank",
      link: "debank.com",
      linkLabe: "debank.com",
      about: t`DeFi Portfolio Tracker`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/LIQ_IO/status/1439711532884152324",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Defi Llama",
      link: "https://defillama.com",
      linkLabel: "defillama.com",
      about: t`Decentralized Finance Dashboard`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/LIQ_IO/status/1438124768033660938",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Dopex",
      link: "https://dopex.io",
      linkLabel: "dopex.io",
      about: t`Decentralized Options Protocol`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/LIQ_IO/status/1482445801523716099",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Rook",
      link: "https://www.rook.fi/",
      linkLabel: "rook.fi",
      about: t`MEV Optimizer`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/Rook/status/1509613786600116251",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Jones DAO",
      link: "https://jonesdao.io",
      linkLabel: "jonesdao.io",
      about: t`Decentralized Options Strategies`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/LIQ_IO/status/1482788805635678212",
      chainIds: [ARBITRUM],
    },
    {
      title: "Yield Yak Optimizer",
      link: "https://yieldyak.com/",
      linkLabel: "yieldyak.com",
      about: t`Yield Optimizer on Avalanche`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/LIQ_IO/status/1484601407378378754",
      chainIds: [AVALANCHE],
    },
    {
      title: "Vovo Finance",
      link: "https://vovo.markets/",
      linkLabel: "vovo.markets",
      about: t`Structured Products`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/VovoFinance/status/1531517177790345217",
      chainIds: [ARBITRUM],
    },
    {
      title: "Stabilize Protocol",
      link: "https://www.stabilize.markets/",
      linkLabel: "stabilize.markets",
      about: t`Yield Vaults`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/StabilizePro/status/1532348674986082306",
      chainIds: [ARBITRUM],
    },
    {
      title: "DODO",
      link: "https://dodoex.io/",
      linkLabel: "dodoex.io",
      about: t`Decentralized Trading Protocol`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/LIQ_IO/status/1438899138549145605",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Open Ocean",
      link: "https://openocean.markets/",
      linkLabel: "openocean.markets",
      about: t`DEX Aggregator`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/LIQ_IO/status/1495780826016989191",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Paraswap",
      link: "https://www.paraswap.io/",
      linkLabel: "paraswap.io",
      about: t`DEX Aggregator`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/paraswap/status/1546869879336222728",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "1inch",
      link: "https://1inch.io/",
      linkLabel: "1inch.io",
      about: t`DEX Aggregator`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/LIQ_IO/status/1522247451410845696",
      chainIds: [ARBITRUM, AVALANCHE],
    },
    {
      title: "Firebird Finance",
      link: "https://app.firebird.markets/swap",
      linkLabel: "firebird.markets",
      about: t`DEX Aggregator`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/financefirebird/status/1561767094064238595",
      chainIds: [AVALANCHE],
    },
    {
      title: "Yield Yak Swap",
      link: "https://yieldyak.com/swap",
      linkLabel: "yieldyak.com",
      about: t`DEX Aggregator`,
      announcementLabel: "twitter.com",
      announcementLink: "https://twitter.com/yieldyak_/status/1484458884827947008",
      chainIds: [AVALANCHE],
    },
  ];

  const telegramGroups = [
    {
      title: "Axion",
      link: "https://t.me/LIQ_IO",
      linkLabel: "t.me",
      about: t`Telegram Group`,
    },
    {
      title: "Axion (Chinese)",
      link: "https://t.me/liqch",
      linkLabel: "t.me",
      about: t`Telegram Group (Chinese)`,
    },
    {
      title: "Axion (Portuguese)",
      link: "https://t.me/LIQ_Portuguese",
      linkLabel: "t.me",
      about: t`Telegram Group (Portuguese)`,
    },
    {
      title: "Axion Trading Chat",
      link: "https://t.me/gambittradingchat",
      linkLabel: "t.me",
      about: t`Axion community discussion`,
    },
  ];

  return (
    <SEO title={getPageTitle("Ecosystem Projects")}>
      <div className="default-container page-layout">
        <div>
          <div className="section-title-block">
            <div className="section-title-icon" />
            <div className="section-title-content">
              <div className="Page-title">
                <Trans>Axion Pages</Trans>
              </div>
              <div className="Page-description">
                <Trans>Axion ecosystem pages.</Trans>
              </div>
            </div>
          </div>
          <div className="DashboardV2-projects">
            {liqPages.map((item) => {
              const linkLabel = item.linkLabel ? item.linkLabel : item.link;
              return (
                <div className="App-card" key={item.title}>
                  <div className="App-card-title">
                    {item.title}
                    <div className="App-card-title-icon">
                      {item.chainIds.map((network) => (
                        <img key={network} src={NETWORK_ICONS[network]} alt={NETWORK_ICON_ALTS[network]} />
                      ))}
                    </div>
                  </div>
                  <div className="App-card-divider"></div>
                  <div className="App-card-content">
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Link</Trans>
                      </div>
                      <div>
                        <ExternalLink href={item.link}>{linkLabel}</ExternalLink>
                      </div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>About</Trans>
                      </div>
                      <div>{item.about}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="Tab-title-section">
            <div className="Page-title">
              <Trans>Community Projects</Trans>
            </div>
            <div className="Page-description">
              <Trans>Projects developed by the Axion community.</Trans>
            </div>
          </div>
          <div className="DashboardV2-projects">
            {communityProjects.map((item) => {
              const linkLabel = item.linkLabel ? item.linkLabel : item.link;
              return (
                <div className="App-card" key={item.title}>
                  <div className="App-card-title">
                    {item.title}
                    <div className="App-card-title-icon">
                      {item.chainIds.map((network) => (
                        <img key={network} src={NETWORK_ICONS[network]} alt={NETWORK_ICON_ALTS[network]} />
                      ))}
                    </div>
                  </div>
                  <div className="App-card-divider" />
                  <div className="App-card-content">
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Link</Trans>
                      </div>
                      <div>
                        <ExternalLink href={item.link}>{linkLabel}</ExternalLink>
                      </div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>About</Trans>
                      </div>
                      <div>{item.about}</div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Creator</Trans>
                      </div>
                      <div>
                        <ExternalLink href={item.creatorLink}>{item.creatorLabel}</ExternalLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="Tab-title-section">
            <div className="Page-title">
              <Trans>Dashboards</Trans>
            </div>
            <div className="Page-description">
              <Trans>Axion dashboards and analytics.</Trans>
            </div>
          </div>
          <div className="DashboardV2-projects">
            {dashboardProjects.map((item) => {
              const linkLabel = item.linkLabel ? item.linkLabel : item.link;
              return (
                <div className="App-card" key={item.title}>
                  <div className="App-card-title">
                    {item.title}
                    <div className="App-card-title-icon">
                      {item.chainIds.map((network) => (
                        <img key={network} src={NETWORK_ICONS[network]} alt={NETWORK_ICON_ALTS[network]} />
                      ))}
                    </div>
                  </div>

                  <div className="App-card-divider"></div>
                  <div className="App-card-content">
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Link</Trans>
                      </div>
                      <div>
                        <ExternalLink href={item.link}>{linkLabel}</ExternalLink>
                      </div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>About</Trans>
                      </div>
                      <div>{item.about}</div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Creator</Trans>
                      </div>
                      <div>
                        <ExternalLink href={item.creatorLink}>{item.creatorLabel}</ExternalLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="Tab-title-section">
            <div className="Page-title">
              <Trans>Partnerships and Integrations</Trans>
            </div>
            <div className="Page-description">
              <Trans>Projects integrated with Axion.</Trans>
            </div>
          </div>
          <div className="DashboardV2-projects">
            {integrations.map((item) => {
              const linkLabel = item.linkLabel ? item.linkLabel : item.link;
              return (
                <div key={item.title} className="App-card">
                  <div className="App-card-title">
                    {item.title}
                    <div className="App-card-title-icon">
                      {item.chainIds.map((network) => (
                        <img key={network} src={NETWORK_ICONS[network]} alt={NETWORK_ICON_ALTS[network]} />
                      ))}
                    </div>
                  </div>
                  <div className="App-card-divider"></div>
                  <div className="App-card-content">
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Link</Trans>
                      </div>
                      <div>
                        <ExternalLink href={item.link}>{linkLabel}</ExternalLink>
                      </div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>About</Trans>
                      </div>
                      <div>{item.about}</div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Announcement</Trans>
                      </div>
                      <div>
                        <ExternalLink href={item.announcementLink}>{item.announcementLabel}</ExternalLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="Tab-title-section">
            <div className="Page-title">
              <Trans>Telegram Groups</Trans>
            </div>
            <div className="Page-description">
              <Trans>Community-led Telegram groups.</Trans>
            </div>
          </div>
          <div className="DashboardV2-projects">
            {telegramGroups.map((item) => {
              const linkLabel = item.linkLabel ? item.linkLabel : item.link;
              return (
                <div className="App-card" key={item.title}>
                  <div className="App-card-title">{item.title}</div>
                  <div className="App-card-divider"></div>
                  <div className="App-card-content">
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>Link</Trans>
                      </div>
                      <div>
                        <ExternalLink href={item.link}>{linkLabel}</ExternalLink>
                      </div>
                    </div>
                    <div className="App-card-row">
                      <div className="label">
                        <Trans>About</Trans>
                      </div>
                      <div>{item.about}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SEO>
  );
}
