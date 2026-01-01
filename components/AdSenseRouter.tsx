"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSenseRouter() {
  const pathname = usePathname();

  useEffect(() => {
    const initializeAds = () => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch {
        // Silently fail - AdSense handles errors internally
      }
    };

    let fallbackTimer: NodeJS.Timeout | null = null;

    // Use requestAnimationFrame to ensure DOM is ready (better than hardcoded delays)
    // Double RAF ensures we wait for the next paint cycle
    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Check if script is loaded, if not wait a bit more
        if (typeof window !== "undefined" && window.adsbygoogle) {
          initializeAds();
        } else {
          // Fallback: script might still be loading, wait a bit
          fallbackTimer = setTimeout(initializeAds, 200);
        }
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
      if (fallbackTimer) {
        clearTimeout(fallbackTimer);
      }
    };
  }, [pathname]);

  return null;
}

