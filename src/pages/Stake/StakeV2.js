import { Trans, t } from "@lingui/macro";
import { useWeb3React } from "@web3-react/core";
import { /*useCallback,*/ useState } from "react";

import Checkbox from "components/Checkbox/Checkbox";
import Modal from "components/Modal/Modal";
import Tooltip from "components/Tooltip/Tooltip";

import LlpManager from "abis/LlpManager.json";
import ReaderV2 from "abis/ReaderV2.json";
import RewardReader from "abis/RewardReader.json";
import RewardRouter from "abis/RewardRouter.json";
import Token from "abis/Token.json";
import Vault from "abis/Vault.json";
// import Vester from "abis/Vester.json";
import { ethers } from "ethers";

import { /*TAIKO_MAINNET,*/ getChainName, getConstant } from "config/chains";
// import { useLiqPrice, /*useTotalLiqStaked*/ } from "domain/legacy";
import {
  PLACEHOLDER_ACCOUNT,
  USD_DECIMALS,
  getBalanceAndSupplyData,
  getDepositBalanceData,
  //getPageTitle,
  getProcessedData,
  getStakingData,
  getVestingData,
} from "lib/legacy";

import useSWR from "swr";

import { getContract } from "config/contracts";

// import SEO from "components/Common/SEO";
// import { getServerUrl } from "config/backend";
import { approveTokens } from "domain/tokens";
import { useChainId } from "lib/chains";
import { callContract, contractFetcher } from "lib/contracts";
// import { helperToast } from "lib/helperToast";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import { /* bigNumberify, expandDecimals,*/ formatAmount } from "lib/numbers";
import "./StakeV2.css";

function ClaimAllModal(props) {
  const {
    isVisible,
    setIsVisible,
    rewardRouterAddress,
    library,
    chainId,
    setPendingTxns,
    wrappedTokenSymbol,
    nativeTokenSymbol,
  } = props;
  const [isClaiming, setIsClaiming] = useState(false);

  const [shouldConvertWeth, setShouldConvertWeth] = useLocalStorageSerializeKey(
    [chainId, "Stake-compound-should-convert-weth"],
    true
  );

  const isPrimaryEnabled = () => {
    return !isClaiming;
  };

  const getPrimaryText = () => {
    if (isClaiming) {
      return "Claim All...";
    }
    return "Claim All";
  };

  const onClickPrimary = () => {
    setIsClaiming(true);

    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, library.getSigner());
    callContract(chainId, contract, "handleRewards", [shouldConvertWeth, false], {
      sentMsg: "Claim All submitted!",
      failMsg: "Claim All failed.",
      successMsg: "Claim All completed!",
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  };

  return (
    <div className="StakeModal">
      <Modal isVisible={isVisible} setIsVisible={setIsVisible} label="Claim All Rewards">
        <div className="CompoundModal-menu">
          <div>
            <Checkbox isChecked={shouldConvertWeth} setIsChecked={setShouldConvertWeth}>
              <span style={{ marginLeft: 5 }}>
                Convert {wrappedTokenSymbol} into {nativeTokenSymbol}
              </span>
            </Checkbox>
          </div>
        </div>
        <div className="Exchange-swap-button-container">
          <button className="Exchange-swap-button default-btn" onClick={onClickPrimary} disabled={!isPrimaryEnabled()}>
            {getPrimaryText()}
          </button>
        </div>
      </Modal>
    </div>
  );
}
function ClaimModal(props) {
  const {
    isVisible,
    setIsVisible,
    rewardRouterAddress,
    library,
    chainId,
    setPendingTxns,
    nativeTokenSymbol,
    wrappedTokenSymbol,
    claimToken,
  } = props;

  const [isClaiming, setIsClaiming] = useState(false);

  const [shouldConvertWeth, setShouldConvertWeth] = useLocalStorageSerializeKey(
    [chainId, "Stake-claim-should-convert-weth"],
    true
  );

  const isPrimaryEnabled = () => {
    return !isClaiming;
  };

  const getPrimaryText = () => {
    if (isClaiming) {
      return `Claiming...`;
    }
    return "Claim";
  };

  const onClickPrimary = () => {
    setIsClaiming(true);

    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, library.getSigner());
    callContract(chainId, contract, "claim", [claimToken.token.address, shouldConvertWeth], {
      sentMsg: "Claim submitted.",
      failMsg: "Claim failed.",
      successMsg: "Claim completed!",
      setPendingTxns,
    })
      .then(async (res) => {
        setIsVisible(false);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  };

  return (
    <div className="StakeModal">
      <Modal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        label={`Claim ${claimToken ? claimToken.token.symbol : ""} Rewards`}
      >
        {claimToken && claimToken.token.symbol === wrappedTokenSymbol && (
          <div className="CompoundModal-menu">
            <div>
              <Checkbox isChecked={shouldConvertWeth} setIsChecked={setShouldConvertWeth}>
                <span style={{ marginLeft: 12 }}>
                  Convert {wrappedTokenSymbol} into {nativeTokenSymbol}
                </span>
              </Checkbox>
            </div>
          </div>
        )}
        <div className="Exchange-swap-button-container">
          <button
            className="App-cta Exchange-swap-button query-modal"
            onClick={onClickPrimary}
            disabled={!isPrimaryEnabled()}
          >
            {getPrimaryText()}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function StakeV2({ setPendingTxns, connectWallet, rewardTokens }) {
  // console.log("rewardTokens", rewardTokens);
  const { active, library, account } = useWeb3React();
  const { chainId } = useChainId();

  const [isClaimAllModalVisible, setIsClaimAllModalVisible] = useState(false);
  const [isClaimModalVisible, setIsClaimModalVisible] = useState(false);
  const [claimToken, setClaimToken] = useState();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCompoundAll, setIsCompoundAll] = useState(false);

  const [isClaim, setIsClaim] = useState();

  const rewardRouterAddress = getContract(chainId, "RewardRouter");

  const nativeTokenSymbol = getConstant(chainId, "nativeTokenSymbol");
  const wrappedTokenSymbol = getConstant(chainId, "wrappedTokenSymbol");

  let isClaimable = (rewardToken) => {
    return rewardToken && rewardToken.reward && rewardToken.reward.gt(0);
  };

  let isClaimableAll = (rewardTokens) => {
    return rewardTokens && Array.isArray(rewardTokens) && rewardTokens.some((r) => r.reward && r.reward.gt(0));
  };

  const getClaimPrimaryText = (buttonToken) => {
    if (isClaiming && isClaim && buttonToken.token.symbol === claimToken.token.symbol) {
      return `Claiming...`;
    }
    return "Claim";
  };

  const getCompoundPrimaryText = (buttonToken) => {
    if (isClaiming && !isClaim && buttonToken.token.symbol === claimToken.token.symbol) {
      return `Compounding...`;
    }
    return "Compound";
  };

  const claim = (claimTokenAddress, shouldAddIntoLLP, shouldConvertWeth) => {
    setIsClaiming(true);
    const primaryName = shouldAddIntoLLP ? "Compound" : "Claim";
    // console.log(claimToken);
    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, library.getSigner());
    callContract(chainId, contract, "claim", [claimTokenAddress, shouldAddIntoLLP, shouldConvertWeth], {
      sentMsg: primaryName + " submitted.",
      failMsg: primaryName + " failed.",
      successMsg: primaryName + " completed!",
      setPendingTxns,
    })
      .then(async (res) => {
        // console.log(res);
      })
      .finally(() => {
        setIsClaiming(false);
      });
  };

  const compoundAll = () => {
    setIsCompoundAll(true);
    const contract = new ethers.Contract(rewardRouterAddress, RewardRouter.abi, library.getSigner());
    callContract(chainId, contract, "handleRewards", [false, true], {
      sentMsg: "Compound All submitted.",
      failMsg: "Compound All failed.",
      successMsg: "Compound All completed!",
      setPendingTxns,
    })
      .then(async (res) => {})
      .finally(() => {
        setIsCompoundAll(false);
      });
  };

  return (
    <div className="">
      <ClaimAllModal
        setPendingTxns={setPendingTxns}
        isVisible={isClaimAllModalVisible}
        setIsVisible={setIsClaimAllModalVisible}
        rewardRouterAddress={rewardRouterAddress}
        wrappedTokenSymbol={wrappedTokenSymbol}
        nativeTokenSymbol={nativeTokenSymbol}
        library={library}
        chainId={chainId}
      />
      <ClaimModal
        active={active}
        account={account}
        setPendingTxns={setPendingTxns}
        isVisible={isClaimModalVisible}
        setIsVisible={setIsClaimModalVisible}
        rewardRouterAddress={rewardRouterAddress}
        wrappedTokenSymbol={wrappedTokenSymbol}
        nativeTokenSymbol={nativeTokenSymbol}
        library={library}
        chainId={chainId}
        claimToken={claimToken}
      />
      <div className="Stake-cards">
        <div className="Stake-card-title">
          <div className="Stake-card-title-mark">Earned</div>
        </div>

        <div className="Stake-card-action">
          <button
            className="default-btn button-claim-stake-action"
            disabled={!active || !isClaimableAll(rewardTokens)}
            onClick={() => {
              setIsClaim(true);
              setIsClaimAllModalVisible(true);
            }}
          >
            Claim All
          </button>
          <Tooltip
            handle={
              <button
                className="default-btn button-compound-stake-action"
                disabled={!active || !isClaimableAll(rewardTokens)}
                onClick={() => {
                  setIsClaim(false);
                  compoundAll();
                }}
              >
                {isCompoundAll ? "Compounding..." : "Compound All"}
              </button>
            }
            renderContent={() => "In case the reward token is in the pool, it will be added to the LLP"}
            position="right-bottom"
          ></Tooltip>
        </div>
        {rewardTokens &&
          rewardTokens.map((rewardToken) => (
            <>
              <div className="Stake-card-title">
                <div className="Stake-card-title-mark-label">
                  {formatAmount(
                    rewardToken.reward,
                    rewardToken.token.decimals,
                    rewardToken.token.rewardDisplayDecimals,
                    true
                  )}
                  {"\u00A0"}
                  {rewardToken.token.symbol}
                  {"\u00A0"}
                  ($
                  {formatAmount(rewardToken.rewardInUsd, USD_DECIMALS, 2, true)})
                </div>
              </div>
              <div className="Stake-card-action">
                <button
                  className="default-btn button-claim-stake-action"
                  disabled={!active || !isClaimable(rewardToken)}
                  onClick={() => {
                    setClaimToken(rewardToken);
                    setIsClaim(true);
                    if (rewardToken.token.symbol === wrappedTokenSymbol) {
                      setIsClaimModalVisible(true);
                    } else {
                      claim(rewardToken.token.address, false, false);
                    }
                  }}
                >
                  {getClaimPrimaryText(rewardToken)}
                </button>
                {rewardToken.token.symbol !== "AXION" && (
                  <button
                    className="default-btn button-compound-stake-action"
                    disabled={!active || !isClaimable(rewardToken)}
                    onClick={() => {
                      setIsClaim(false);
                      setClaimToken(rewardToken);
                      claim(rewardToken.token.address, true, false);
                    }}
                  >
                    {getCompoundPrimaryText(rewardToken)}
                  </button>
                )}
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
