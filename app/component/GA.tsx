"use client";

/**
 * google-analytics script tag(GA-4)を設定するコンポーネント。
 * - 管理者ページの場合は設定しない：/admin、/login
 * - NODE_ENVがproductionでない場合は設定しない
 * RootLayoutのbodyの直前に入れる。
 * <html>
 *   <GA />
 *   <body></body>
 * </html>
 */

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function GA() {
  const path = usePathname();

  // 管理者画面の場合は設定しない
  if (path === "/login" || path === "/admin") {
    return null;
  }

  // productionでない場合は設定しない
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-V9TR64QDHY"
        strategy='afterInteractive'
      />
      <Script id="google-analytics" strategy='afterInteractive'>
        {`
         window.dataLayer = window.dataLayer || [];
         function gtag() { dataLayer.push(arguments); }
         gtag('js', new Date());
     
         gtag('config', 'G-V9TR64QDHY');
      `}
      </Script>
    </>
  );
}