// ===========================================
// NOT IN USE, DELETE IF WORKS ON PRODUCTION
// ===========================================

"use client";

import { useEffect, useState, useRef } from "react";

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
  const adElementRef = useRef<HTMLModElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Helper to check if script tag exists in DOM (verifies script loaded)
    const isScriptTagPresent = () => {
      if (typeof document === "undefined") return false;
      const script = document.querySelector(
        'script[src*="adsbygoogle.js"], script[id="adsbygoogle-init"]'
      );
      return script !== null;
    };

    // Helper to check if AdSense script is loaded and ready
    // Verifies script tag exists, window.adsbygoogle exists, and document is ready
    // This prevents race condition where push({}) is called before script is ready
    const isAdSenseReady = () => {
      if (typeof window === "undefined" || typeof document === "undefined") {
        return false;
      }
      
      return (
        window.adsbygoogle &&
        document.readyState === "complete" &&
        isScriptTagPresent() && // ✅ Verify script tag exists to prevent race condition
        adElementRef.current
      );
    };

    const initializeAdUnit = () => {
      try {
        if (isAdSenseReady()) {
          // For manual ad units, push empty object to initialize this specific ad unit
          // AdSense will find the <ins> element by its data-ad-slot attribute
          window.adsbygoogle!.push({});
        }
      } catch {
        // Silently fail - AdSense handles errors internally
      }
    };

    // Cleanup function
    const cleanup = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Wait for DOM to be ready and element to be rendered
    rafIdRef.current = requestAnimationFrame(() => {
      // Check if document is ready
      if (document.readyState === "complete") {
        // Small delay to ensure element is fully in the DOM
        timeoutRef.current = setTimeout(() => {
          initializeAdUnit();
        }, 100);
      } else {
        // Wait for document to be complete
        const checkReady = () => {
          if (document.readyState === "complete") {
            timeoutRef.current = setTimeout(() => {
              initializeAdUnit();
            }, 100);
          } else {
            timeoutRef.current = setTimeout(checkReady, 50);
          }
        };
        timeoutRef.current = setTimeout(checkReady, 50);
      }
    });

    return cleanup;
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
      ref={adElementRef}
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block", ...style }}
      data-ad-client="ca-pub-4895395148287261"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}