import { useWeb3React } from "@web3-react/core";
import connectWalletImg from "img/ic_wallet_24.svg";
import { useCallback, useEffect } from "react";
import AddressDropdown from "../AddressDropdown/AddressDropdown";
import ConnectWalletButton from "../Common/ConnectWalletButton";
import { HeaderLink } from "./HeaderLink";

import { Trans } from "@lingui/macro";
import cx from "classnames";
import { TAIKO_MAINNET, getChainName } from "config/chains";
import { useChainId } from "lib/chains";
import { getAccountUrl, isDevelopment } from "lib/legacy";
import { switchNetwork } from "lib/wallets";
import { useHistory } from "react-router-dom";
import LanguagePopupHome from "../NetworkDropdown/LanguagePopupHome";
import NetworkDropdown from "../NetworkDropdown/NetworkDropdown";
import "./Header.css";

type Props = {
  openSettings: () => void;
  small?: boolean;
  setWalletModalVisible: (visible: boolean) => void;
  disconnectAccountAndCloseSettings: () => void;
  redirectPopupTimestamp: number;
  showRedirectModal: (to: string) => void;
};

export function AppHeaderUser({
  openSettings,
  small,
  setWalletModalVisible,
  disconnectAccountAndCloseSettings,
  redirectPopupTimestamp,
  showRedirectModal,
}: Props) {
  const { chainId } = useChainId();
  const { active, account } = useWeb3React();

  const history = useHistory();
  const isLanding = history.location.pathname === "/" ? true : false;
  const showConnectionOptions = !isLanding;

  const networkOptions = [
    {
      label: getChainName(TAIKO_MAINNET),
      value: TAIKO_MAINNET,
      icon: "167000.png",
      color: "#264f79",
    },
    // {
    //   label: getChainName(ARBITRUM),
    //   value: ARBITRUM,
    //   icon: "ic_arbitrum_24.svg",
    //   color: "#264f79",
    // },
    // {
    //   label: getChainName(AVALANCHE),
    //   value: AVALANCHE,
    //   icon: "ic_avalanche_24.svg",
    //   color: "#E841424D",
    // },
  ];
  if (isDevelopment()) {
    // networkOptions.push({
    //   label: getChainName(ARBITRUM_TESTNET),
    //   value: ARBITRUM_TESTNET,
    //   icon: "ic_arbitrum_24.svg",
    //   color: "#264f79",
    // });
  }

  useEffect(() => {
    if (active) {
      setWalletModalVisible(false);
    }
  }, [active, setWalletModalVisible]);

  const onNetworkSelect = useCallback(
    (option) => {
      if (option.value === chainId) {
        return;
      }
      return switchNetwork(option.value, active);
    },
    [chainId, active]
  );

  const selectorLabel = getChainName(chainId);

  if (!active || !account) {
    return (
      <div className="App-header-user">
        <div className={cx("App-header-trade-link", { "homepage-header": isLanding })}>
          {isLanding ? (
            <a className="default-btn" href="/#/trade">
              <Trans>Launch App</Trans>
            </a>
          ) : (
            <HeaderLink
              className="App-wallet-connect"
              to="/trade"
              redirectPopupTimestamp={redirectPopupTimestamp}
              showRedirectModal={showRedirectModal}
            >
              <Trans>Trade</Trans>
            </HeaderLink>
          )}
        </div>

        {showConnectionOptions ? (
          <>
            <ConnectWalletButton onClick={() => setWalletModalVisible(true)} imgSrc={connectWalletImg}>
              {small ? <Trans>Connect</Trans> : <Trans>Connect Wallet</Trans>}
            </ConnectWalletButton>
            <NetworkDropdown
              small={small}
              networkOptions={networkOptions}
              selectorLabel={selectorLabel}
              onNetworkSelect={onNetworkSelect}
              openSettings={openSettings}
            />
          </>
        ) : (
          <LanguagePopupHome />
        )}
      </div>
    );
  }

  const accountUrl = getAccountUrl(chainId, account);

  return (
    <div className="App-header-user">
      <div className="App-header-trade-link">
        {/* <HeaderLink
          className="default-btn"
          to="/trade"
          redirectPopupTimestamp={redirectPopupTimestamp}
          showRedirectModal={showRedirectModal}
        >
          <Trans>Trade</Trans>
        </HeaderLink> */}
        <a className="default-btn" href="/#/trade">
          <Trans>Trade</Trans>
        </a>
      </div>

      {showConnectionOptions ? (
        <>
          <div className="App-header-user-address">
            <AddressDropdown
              account={account}
              accountUrl={accountUrl}
              disconnectAccountAndCloseSettings={disconnectAccountAndCloseSettings}
            />
          </div>
          <NetworkDropdown
            small={small}
            networkOptions={networkOptions}
            selectorLabel={selectorLabel}
            onNetworkSelect={onNetworkSelect}
            openSettings={openSettings}
          />
        </>
      ) : (
        <LanguagePopupHome />
      )}
    </div>
  );
}
