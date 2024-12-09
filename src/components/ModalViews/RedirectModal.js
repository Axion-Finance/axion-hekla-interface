import "./RedirectModal.css";
import Modal from "../Modal/Modal";
import Checkbox from "../Checkbox/Checkbox";
import { t, Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";

export function RedirectPopupModal({
  redirectModalVisible,
  setRedirectModalVisible,
  appRedirectUrl,
  setRedirectPopupTimestamp,
  setShouldHideRedirectModal,
  shouldHideRedirectModal,
}) {
  const onClickAgree = () => {
    if (shouldHideRedirectModal) {
      setRedirectPopupTimestamp(Date.now());
    }
  };

  return (
    <Modal
      className="RedirectModal"
      isVisible={redirectModalVisible}
      setIsVisible={setRedirectModalVisible}
      label={t`Launch App`}
    >
      <Trans>
        {/* Alternative links can be found in the{" "}
        <ExternalLink href="docs.axion.markets">docs</ExternalLink>
        . */}
        <br />
        <br />
        By clicking Agree you accept the{" "}
        <ExternalLink href="https://axion.markets/#/terms-and-conditions">T&Cs</ExternalLink> and{" "}
        <ExternalLink href="https://axion.markets/#/referral-terms">Referral T&Cs</ExternalLink>.
        <br />
        <br />
      </Trans>
      <div className="mb-sm">
        <Checkbox isChecked={shouldHideRedirectModal} setIsChecked={setShouldHideRedirectModal}>
          <Trans>Don't show this message again for 30 days.</Trans>
        </Checkbox>
      </div>
      <a href={appRedirectUrl} className="default-btn Exchange-swap-button" onClick={onClickAgree}>
        <Trans>Agree</Trans>
      </a>
    </Modal>
  );
}
