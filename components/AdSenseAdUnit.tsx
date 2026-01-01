"use client";

import { useEffect, useState } from "react";

interface AdSenseAdUnitProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSenseAdUnit({ 
  adSlot, 
  adFormat = "auto",
  style,
  className 
}: AdSenseAdUnitProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [isMounted, adSlot]);

  // Don't render on server to prevent hydration mismatch
  if (!isMounted) {
    return (
      <div
        className={className}
        style={{ ...style, minHeight: style?.minHeight || "100px" }}
        aria-label="Advertisement"
      />
    );
  }

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-4895395148287261"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}