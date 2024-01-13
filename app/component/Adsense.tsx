/**
 * Google Adsense用Scriptコンポーネント
 */

import Script from "next/script";

export default function Adsense() {
  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5798674593050703"
      crossOrigin="anonymous"
    />
  );
}