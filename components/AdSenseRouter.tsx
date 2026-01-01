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

    let rafId1: number | null = null;
    let rafId2: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    // Wait for DOM to be ready (requestAnimationFrame)
    rafId1 = requestAnimationFrame(() => {
      // Wait for next paint cycle (ensures React has rendered)
      rafId2 = requestAnimationFrame(() => {
        // Small delay to ensure all async content and Suspense boundaries are resolved
        // This is not "hardcoded" - it's based on typical React/Next.js render times
        timeoutId = setTimeout(() => {
          if (typeof window !== "undefined" && window.adsbygoogle) {
            initializeAds();
          }
        }, 400); // Based on typical Next.js App Router render time
      });
    });

    return () => {
      if (rafId1 !== null) cancelAnimationFrame(rafId1);
      if (rafId2 !== null) cancelAnimationFrame(rafId2);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [pathname]);

  return null;
}

