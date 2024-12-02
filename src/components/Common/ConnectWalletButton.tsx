import { ReactNode } from "react";
import "./ConnectWalletButton.scss";

type Props = {
  imgSrc: string;
  children: ReactNode;
  onClick: () => void;
  className?: string;
};

export default function ConnectWalletButton({ imgSrc, children, onClick, className }: Props) {
  return (
    <button className="App-wallet-connect" onClick={onClick}>
      {imgSrc && <img className="btn-icon" src={imgSrc} alt="Connect Wallet" />}
      &nbsp;&nbsp;
      <span className="btn-label">{children}</span>
    </button>
  );
}
