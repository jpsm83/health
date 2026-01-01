"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSenseRouter() {
  const pathname = usePathname();
  const isInitialMount = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafId1Ref = useRef<number | null>(null);
  const rafId2Ref = useRef<number | null>(null);
  const rafId3Ref = useRef<number | null>(null);

  useEffect(() => {
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
        isScriptTagPresent() // ✅ Use helper to verify script tag exists and prevent race condition
      );
    };

    const initializeAds = () => {
      try {
        if (isAdSenseReady()) {
          window.adsbygoogle!.push({});
        }
      } catch {
        // Silently fail - AdSense handles errors internally
      }
    };

    // Cleanup function
    const cleanup = () => {
      if (rafId1Ref.current !== null) {
        cancelAnimationFrame(rafId1Ref.current);
        rafId1Ref.current = null;
      }
      if (rafId2Ref.current !== null) {
        cancelAnimationFrame(rafId2Ref.current);
        rafId2Ref.current = null;
      }
      if (rafId3Ref.current !== null) {
        cancelAnimationFrame(rafId3Ref.current);
        rafId3Ref.current = null;
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Handle initial mount (SSR → Client hydration)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      
      // On initial mount, use adaptive timing to catch fast loads early
      // but still handle slow networks with retries
      let retryCount = 0;
      const maxRetries = 20; // Increased retries but with shorter intervals
      const retryInterval = 200; // Shorter interval for faster response
      
      const checkAndInit = () => {
        // Verify script tag exists in DOM (script loaded)
        if (!isScriptTagPresent()) {
          retryCount++;
          if (retryCount < maxRetries) {
            // Retry every 200ms if script not loaded yet
            timeoutRef.current = setTimeout(checkAndInit, retryInterval);
          }
          return;
        }

        // Script tag exists, now check if AdSense is ready
        if (isAdSenseReady()) {
          // Script is ready - trigger scan as fallback (auto-scan might have already run, which is fine)
          // This ensures ads load even if auto-scan didn't trigger
          try {
            window.adsbygoogle!.push({});
          } catch {
            // Silently fail
          }
        } else {
          // Script loaded but AdSense not ready yet, retry with shorter interval
          retryCount++;
          if (retryCount < maxRetries) {
            timeoutRef.current = setTimeout(checkAndInit, retryInterval);
          }
        }
      };

      // Start checking earlier (200ms) to catch fast script loads
      // This makes it adaptive - fast networks get ads quickly, slow networks get retries
      timeoutRef.current = setTimeout(checkAndInit, 200);
      
      return cleanup;
    }

    // Wait for DOM to be ready (requestAnimationFrame)
    rafId1Ref.current = requestAnimationFrame(() => {
      // Wait for next paint cycle (ensures React has rendered)
      rafId2Ref.current = requestAnimationFrame(() => {
        // Check document ready state before proceeding
        if (document.readyState === "complete") {
          // Additional RAF cycle to ensure layout stability
          // This helps catch any late layout shifts from Suspense boundaries
          rafId3Ref.current = requestAnimationFrame(() => {
            // Verify script is loaded before proceeding
            if (!isScriptTagPresent()) {
              // Script not loaded yet, wait and retry with max limit
              let retryCount = 0;
              const maxRetries = 15; // Try for up to 3 seconds (15 * 200ms)
              
              const retryInit = () => {
                if (isScriptTagPresent() && isAdSenseReady()) {
                  initializeAds();
                } else {
                  retryCount++;
                  if (retryCount < maxRetries) {
                    timeoutRef.current = setTimeout(retryInit, 200);
                  }
                  // If max retries reached, silently fail (script may not load)
                }
              };
              timeoutRef.current = setTimeout(retryInit, 200);
              return;
            }

            // Delay to ensure Suspense boundaries and async content are fully resolved
            // Increased to 500ms for better reliability with slow networks/Suspense boundaries
            timeoutRef.current = setTimeout(() => {
              if (isAdSenseReady()) {
                initializeAds();
              }
            }, 500);
          });
        } else {
          // Wait for document to be complete with polling
          const checkReady = () => {
            if (document.readyState === "complete") {
              // Additional RAF cycle for layout stability
              rafId3Ref.current = requestAnimationFrame(() => {
                // Verify script is loaded before proceeding
                if (!isScriptTagPresent()) {
                  // Script not loaded yet, wait and retry with max limit
                  let retryCount = 0;
                  const maxRetries = 15; // Try for up to 3 seconds (15 * 200ms)
                  
                  const retryInit = () => {
                    if (isScriptTagPresent() && isAdSenseReady()) {
                      initializeAds();
                    } else {
                      retryCount++;
                      if (retryCount < maxRetries) {
                        timeoutRef.current = setTimeout(retryInit, 200);
                      }
                      // If max retries reached, silently fail (script may not load)
                    }
                  };
                  timeoutRef.current = setTimeout(retryInit, 200);
                  return;
                }

                timeoutRef.current = setTimeout(() => {
                  if (isAdSenseReady()) {
                    initializeAds();
                  }
                }, 500);
              });
            } else {
              // Poll every 50ms until ready
              timeoutRef.current = setTimeout(checkReady, 50);
            }
          };
          timeoutRef.current = setTimeout(checkReady, 50);
        }
      });
    });

    return cleanup;
  }, [pathname]);

  return null;
}

