import { t } from "@lingui/macro";
import { LANGUAGE_LOCALSTORAGE_KEY } from "config/localStorage";
import { defaultLocale } from "lib/i18n";
import { useRef, useState } from "react";
import ModalWithPortal from "../Modal/ModalWithPortal";
import LanguageModalContent from "./LanguageModalContent";
import "./NetworkDropdown.css";

export default function LanguagePopupHome() {
  const currentLanguage = useRef(localStorage.getItem(LANGUAGE_LOCALSTORAGE_KEY) || defaultLocale);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  return (
    <>
      {/* <div className="App-header-network App-header-language" onClick={() => setIsLanguageModalOpen(true)}>
        <div className={cx("network-dropdown", { "homepage-header": isHomeSite() })}>
          <button className={cx("btn-primary small transparent")}>
            <img className="network-dropdown-icon" src={language24Icon} alt="Select Language" />
          </button>
        </div>
      </div> */}

      <ModalWithPortal
        className="language-popup"
        isVisible={isLanguageModalOpen}
        setIsVisible={setIsLanguageModalOpen}
        label={t`Select Language`}
      >
        <LanguageModalContent currentLanguage={currentLanguage} />
      </ModalWithPortal>
    </>
  );
}
