import React, { useMemo } from "react";
import { useMediaQuery } from "react-responsive";

function useMatchBreakPoints() {
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 1224 });
  const isBigScreen = useMediaQuery({ minWidth: 1824 });
  const isTablet = useMediaQuery({ maxWidth: 1224 });
  const isMobile = useMediaQuery({ maxWidth: 600 });

  return useMemo(() => {
    return {
      isDesktopOrLaptop,
      isBigScreen,
      isTablet,
      isMobile,
    };
  }, [isDesktopOrLaptop, isBigScreen, isTablet, isMobile, useMediaQuery]);
}

export default useMatchBreakPoints;
