"use client";

import Script from "next/script";

export default function AdSenseProvider() {
  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4895395148287261"
      crossOrigin="anonymous"
    />
  );
}

