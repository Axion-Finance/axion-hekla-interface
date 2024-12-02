import { Trans } from "@lingui/macro";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import { BigNumber } from "ethers";
import { formatKeyAmount } from "lib/numbers";

type Props = {
  processedData: {
    liqAprForEsLiq: BigNumber;
    liqAprForNativeToken: BigNumber;
    liqAprForNativeTokenWithBoost: BigNumber;
    liqBoostAprForNativeToken?: BigNumber;
  };
  nativeTokenSymbol: string;
};

export default function LIQAprTooltip({ processedData, nativeTokenSymbol }: Props) {
  return (
    <>
      <StatsTooltipRow
        label="Escrowed LIQLIQ APR"
        showDollar={false}
        value={`${formatKeyAmount(processedData, "liqAprForEsLiq", 2, 2, true)}%`}
      />
      {(!processedData.liqBoostAprForNativeToken || processedData.liqBoostAprForNativeToken.eq(0)) && (
        <StatsTooltipRow
          label={`${nativeTokenSymbol} APR`}
          showDollar={false}
          value={`${formatKeyAmount(processedData, "liqAprForNativeToken", 2, 2, true)}%`}
        />
      )}
      {processedData.liqBoostAprForNativeToken && processedData.liqBoostAprForNativeToken.gt(0) && (
        <div>
          <br />

          <StatsTooltipRow
            label={`${nativeTokenSymbol} Base APR`}
            showDollar={false}
            value={`${formatKeyAmount(processedData, "liqAprForNativeToken", 2, 2, true)}%`}
          />
          <StatsTooltipRow
            label={`${nativeTokenSymbol} Boosted APR`}
            showDollar={false}
            value={`${formatKeyAmount(processedData, "liqBoostAprForNativeToken", 2, 2, true)}%`}
          />
          <div className="Tooltip-divider" />
          <StatsTooltipRow
            label={`${nativeTokenSymbol} Total APR`}
            showDollar={false}
            value={`${formatKeyAmount(processedData, "liqAprForNativeTokenWithBoost", 2, 2, true)}%`}
          />

          <br />

          <Trans>The Boosted APR is from your staked Multiplier Points.</Trans>
        </div>
      )}
      <div>
        <br />
        <Trans>APRs are updated weekly and will depend on the fees collected for the week.</Trans>
      </div>
    </>
  );
}
