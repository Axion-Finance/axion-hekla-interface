import { t } from "@lingui/macro";
import logoImg from "img/landingpage/logos/logo-light.svg";
import { FiX } from "react-icons/fi";

import ExternalLink from "components/ExternalLink/ExternalLink";
import { Link } from "react-router-dom";
import "./Header.css";

type Props = {
  small?: boolean;
  clickCloseIcon?: () => void;
};

const HOME_MENUS = [
  {
    label: t`App`,
    link: "https://axion.markets/#/trade",
  },
  {
    label: t`Protocol`,
    link: "https://github.com/axion-markets/",
  },
  // {
  //   label: t`Governance`,
  //   link: "/",
  // },
  // {
  //   label: t`Voting`,
  //   link: "/",
  // },
  {
    label: t`Docs`,
    link: "docs.axion.finance/",
  },
];

export function HomeHeaderLinks({ small, clickCloseIcon }: Props) {
  return (
    <div className="App-header-links">
      {small && (
        <div className="App-header-links-header">
          <Link className="App-header-link-main" to="/">
            <img src={logoImg} alt="Axion Logo" />
          </Link>

          <div
            className="App-header-menu-icon-block mobile-cross-menu"
            onClick={() => clickCloseIcon && clickCloseIcon()}
          >
            <FiX className="App-header-menu-icon" />
          </div>
        </div>
      )}
      {HOME_MENUS.map(({ link, label }) => (
        <div key={label} className="App-header-link-container">
          <ExternalLink href={link}>{label}</ExternalLink>
        </div>
      ))}
    </div>
  );
}
