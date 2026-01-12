"use client";

import React, { useEffect, useRef, useMemo } from "react";

interface AdBannerProps {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  uniqueId?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const AdBanner = ({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  uniqueId,
  className,
}: AdBannerProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const elementId = useMemo(
    () => uniqueId || `adbanner-${Math.random().toString(36).substr(2, 9)}`,
    [uniqueId]
  );

  useEffect(() => {
    const getAdElement = () => {
      return document.getElementById(elementId) as HTMLElement | null;
    };

    const hasAdsInitialized = () => {
      const element = getAdElement();
      return element?.getAttribute("data-adsbygoogle-status") !== null;
    };

    const initializeAd = () => {
      if (hasAdsInitialized()) return;

      const element = getAdElement();
      if (!element) return;

      if (window.adsbygoogle && document.readyState === "complete") {
        try {
          window.adsbygoogle.push({});
        } catch {
          // AdSense handles errors
        }
      }
    };

    const tryInitialize = () => {
      if (document.readyState === "complete") {
        timeoutRef.current = setTimeout(initializeAd, 300);
      } else {
        timeoutRef.current = setTimeout(tryInitialize, 100);
      }
    };

    timeoutRef.current = setTimeout(tryInitialize, 200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dataAdSlot, elementId]);

  return (
    <div className={`flex justify-center bg-blue-500 ${className}`}>
      <ins
        id={elementId}
        className="adsbygoogle"
        style={{ display: "block", minWidth: "320px", minHeight: "100px" }}
        data-ad-client="ca-pub-4895395148287261"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
        suppressHydrationWarning
      />
    </div>
  );
};

export default AdBanner;