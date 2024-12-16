import { Trans } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { TAIKO_MAINNET } from "config/chains";
import llpBigIcon from "img/ic_llp_custom.svg";
import { useChainId } from "lib/chains";
//import { isHomeSite } from "lib/legacy";
import { switchNetwork } from "lib/wallets";
import { useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import APRLabel from "../APRLabel/APRLabel";
import { HeaderLink } from "../Header/HeaderLink";

export default function TokenCard({ showRedirectModal, redirectPopupTimestamp }) {
  //const isHome = isHomeSite();
  const history = useHistory();
  const isLanding = history.location.pathname === "/" ? true : false;
  const { chainId } = useChainId();
  const { active } = useWeb3React();

  const changeNetwork = useCallback(
    (network) => {
      if (network === chainId) {
        return;
      }
      if (!active) {
        setTimeout(() => {
          return switchNetwork(network, active);
        }, 500);
      } else {
        return switchNetwork(network, active);
      }
    },
    [chainId, active]
  );

  const BuyLink = ({ className, to, children, network }) => {
    if (isLanding && showRedirectModal) {
      return (
        <HeaderLink
          to={to}
          className={className}
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          {children}
        </HeaderLink>
      );
    }

    return (
      <Link to={to} className={className} onClick={() => changeNetwork(network)}>
        {children}
      </Link>
    );
  };

  return (
    <div className="Home-token-card-options">
      <div className="Home-token-card-option card">
        <div className="Home-token-card-option-icon">
          <img src={llpBigIcon} alt="mlpBigIcon" /> LLP
        </div>
        <div className="Home-token-card-option-info">
          <div className="Home-token-card-option-title">
            <Trans>LLP is the liquidity provider token. Accrues 60% of the platform's generated fees.</Trans>
          </div>
          <div className="Home-token-card-option-apr">
            {/* <Trans>Arbitrum APR:</Trans> <APRLabel chainId={ARBITRUM} label="glpAprTotal" key="ARBITRUM" />,{" "} */}
            <Trans>APR:</Trans> <APRLabel chainId={TAIKO_MAINNET} label="glpAprTotal" key="TAIKO_MAINNET" />
            {/* <Trans>APR:</Trans> --% */}
          </div>
          <div className="Home-token-card-option-action">
            <div className="buy">
              {isLanding ? (
                <ExternalLink href="https://axion.markets/#/liquidity" className="default-btn read-more">
                  <Trans>Buy</Trans>
                </ExternalLink>
              ) : (
                <BuyLink to="/liquidity" className="default-btn" network={TAIKO_MAINNET}>
                  <Trans>Buy</Trans>
                </BuyLink>
              )}

              {/* <BuyLink to="/liquidity" className="default-btn" network={ARBITRUM}>
                <Trans>Buy on Arbitrum</Trans>
              </BuyLink>
              <BuyLink to="/liquidity" className="default-btn" network={AVALANCHE}>
                <Trans>Buy on Avalanche</Trans>
              </BuyLink> */}
            </div>
            <a href="docs.axion.finance/llp" target="_blank" rel="noreferrer" className="secondary-btn read-more">
              <Trans>Read more</Trans>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
