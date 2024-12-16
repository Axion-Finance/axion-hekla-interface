import { Trans } from "@lingui/macro";
import { FiX } from "react-icons/fi";
//import { Link } from "react-router-dom";

import { useHistory } from "react-router-dom";
import "./Header.css";
import { HeaderLink } from "./HeaderLink";
//import { isHomeSite } from "lib/legacy";
import ExternalLink from "components/ExternalLink/ExternalLink";
import logoImg from "img/logo.png";
//import icDown from "img/icons/dropdown-ic.svg";

type Props = {
  small?: boolean;
  clickCloseIcon?: () => void;
  openSettings?: () => void;
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
};

export function AppHeaderLinks({
  small,
  openSettings,
  clickCloseIcon,
  redirectPopupTimestamp,
  showRedirectModal,
}: Props) {
  const history = useHistory();
  const isLanding = history.location.pathname === "/" ? true : false;
  return (
    <div className="App-header-links">
      {small && (
        <div className="App-header-links-header">
          <a className="App-header-link-main" href="https://axion.markets/">
            <img src={logoImg} alt="AXION Logo" />
            AXION<span style={{ color: "orange" }}></span>
          </a>
          <div
            className="App-header-menu-icon-block mobile-cross-menu"
            onClick={() => clickCloseIcon && clickCloseIcon()}
          >
            <FiX className="App-header-menu-icon" />
          </div>
        </div>
      )}
      <div className="App-header-link-container">
        <HeaderLink
          to="/dashboard"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
          className="text-primary"
        >
          <Trans>Dashboard</Trans>
        </HeaderLink>
      </div>
      {/* <div className="App-header-link-container">
        <HeaderLink to="/earn" redirectPopupTimestamp={redirectPopupTimestamp} showRedirectModal={showRedirectModal}>
          <Trans>Earn</Trans>
        </HeaderLink>
      </div> */}
      <div className="App-header-link-container">
        <HeaderLink
          to="/liquidity"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>Liquidity</Trans>
        </HeaderLink>
      </div>
      <div className="App-header-link-container">
        <HeaderLink
          to="/referrals"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>Referrals</Trans>
        </HeaderLink>
      </div>
      {/* <div className="App-header-link-container">
        <HeaderLink
          to="/ecosystem"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>Ecosystem</Trans>
        </HeaderLink>
      </div> */}
      {/* <div className="App-header-link-container">
        <HeaderLink
          to="/proof-of-locked-liquidity"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>PoLL</Trans>
        </HeaderLink>
      </div> */}
      <div className="App-header-link-container">
        <ExternalLink href="docs.axion.finance">
          <Trans>About</Trans>
        </ExternalLink>
      </div>
      {small && !isLanding && (
        <div className="App-header-link-container">
          {/* eslint-disable-next-line */}
          <a href="#" onClick={openSettings}>
            <Trans>Settings</Trans>
          </a>
        </div>
      )}
    </div>
  );
}
