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
    // Re-initialize AdSense auto ads on route changes
    // This tells AdSense to re-scan the page for auto ad placements
    const initializeAds = () => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          window.adsbygoogle.push({});
        }
      } catch (err) {
        // Silently fail - AdSense handles errors internally
        // Don't log to avoid console spam
      }
    };

    // Small delay to ensure page content is rendered
    const timer = setTimeout(initializeAds, 100);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}

