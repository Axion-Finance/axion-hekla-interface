import { Menu } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";
import "./AssetDropdown.css";
import coingeckoIcon from "img/ic_coingecko_16.svg";
import arbitrumIcon from "img/ic_arbitrum_16.svg";
import avalancheIcon from "img/ic_avalanche_16.svg";
import metamaskIcon from "img/ic_metamask_16.svg";
import { useWeb3React } from "@web3-react/core";

import { t, Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { ICONLINKS, PLATFORM_TOKENS } from "config/tokens";
import { addTokenToMetamask } from "lib/wallets";
import { useChainId } from "lib/chains";
import { ARBITRUM } from "config/chains";
import { Token } from "domain/tokens";

type Props = {
  assetSymbol: string;
  assetInfo?: Token;
};

function AssetDropdown({ assetSymbol, assetInfo }: Props) {
  const { active } = useWeb3React();
  const { chainId } = useChainId();
  let { coingecko, arbitrum, avalanche, reserves } = ICONLINKS[chainId][assetSymbol] || {};
  const unavailableTokenSymbols =
    {
      42161: ["ETH"],
      43114: ["AVAX"],
      250: ["FTM"],
    }[chainId] || [];

  return (
    <Menu>
      <Menu.Button as="div" className="dropdown-arrow center-both">
        <FiChevronDown size={20} />
      </Menu.Button>
      <Menu.Items as="div" className="asset-menu-items">
        <Menu.Item>
          <>
            {reserves && assetSymbol === "LLP" && (
              <ExternalLink href={reserves} className="asset-item">
                <img src={chainId === ARBITRUM ? arbitrumIcon : avalancheIcon} alt="Proof of Reserves" />
                <p>
                  <Trans>Proof of Reserves</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item>
        <Menu.Item>
          <>
            {coingecko && (
              <ExternalLink href={coingecko} className="asset-item">
                <img src={coingeckoIcon} alt="Open in Coingecko" />
                <p>
                  <Trans>Open in Coingecko</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item>
        <Menu.Item>
          <>
            {arbitrum && (
              <ExternalLink href={arbitrum} className="asset-item">
                <img src={arbitrumIcon} alt="Open in explorer" />
                <p>
                  <Trans>Open in Explorer</Trans>
                </p>
              </ExternalLink>
            )}
            {avalanche && (
              <ExternalLink href={avalanche} className="asset-item">
                <img src={avalancheIcon} alt="Open in explorer" />
                <p>
                  <Trans>Open in Explorer</Trans>
                </p>
              </ExternalLink>
            )}
          </>
        </Menu.Item>
        <Menu.Item>
          <>
            {active && unavailableTokenSymbols.indexOf(assetSymbol) < 0 && (
              <div
                onClick={() => {
                  let token = assetInfo
                    ? { ...assetInfo, image: assetInfo.imageUrl }
                    : PLATFORM_TOKENS[chainId][assetSymbol];
                  addTokenToMetamask(token);
                }}
                className="asset-item"
              >
                <img src={metamaskIcon} alt={t`Add to Metamask`} />
                <p>
                  <Trans>Add to Metamask</Trans>
                </p>
              </div>
            )}
          </>
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export default AssetDropdown;
