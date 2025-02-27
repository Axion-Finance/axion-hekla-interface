import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

// import Footer from "components/Footer/Footer";
import GlpSwap from "components/Glp/GlpSwap";
import buyGLPIcon from "img/ic_buy_glp.svg";
import "./BuyLlp.css";

import { Trans, t } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { getNativeToken } from "config/tokens";
import { useChainId } from "lib/chains";

export default function BuyLlp(props) {
  const { chainId } = useChainId();
  const history = useHistory();
  const [isBuying, setIsBuying] = useState(true);
  const nativeTokenSymbol = getNativeToken(chainId).symbol;
  // // console.log("Native Token Symbol: ", nativeTokenSymbol);
  useEffect(() => {
    const hash = history.location.hash.replace("#", "");
    const buying = hash === "redeem" ? false : true;
    setIsBuying(buying);
  }, [history.location.hash]);

  return (
    <div className="default-container page-layout">
      <div className="section-title-block">
        <div className="section-title-icon">
          <img src={buyGLPIcon} alt={t`Buy LLP Icon`} />
        </div>
        <div className="section-title-content">
          <div className="Page-title">
            <Trans>Buy / Sell LLP</Trans>
          </div>
          <div className="Page-description">
            <Trans>
              Purchase <ExternalLink href="docs.axion.finance/llp">LLP tokens</ExternalLink> to earn {nativeTokenSymbol}{" "}
              fees from swaps and leverages trading.
            </Trans>
            <br />
            {/* <Trans>
              Note that there is a minimum holding time of 15 minutes after a purchase.
              <br />
              View <Link to="/earn">staking</Link> page.
            </Trans> */}
          </div>
        </div>
      </div>
      <GlpSwap {...props} isBuying={isBuying} setIsBuying={setIsBuying} />
    </div>
  );
}
