import type { AppProps } from 'next/app'
import { useEffect } from "react";
import Script from 'next/script';
import '../styles/globals.css' //　全ページ・コンポーネントに適用されるcss
import "prismjs/themes/prism-tomorrow.css"; // syntax hightlight用
import "../styles/prism-overrides.css"; // syntax hightlightをカスタム


function MyApp({ Component, pageProps, router }: AppProps) {

  useEffect(() => {
    // home,about,201103_1,,,等、パス名取得。db更新の条件にしている。
    // dirはpages/postのダイナミックルートで使用している。
    // 別のダイナミックルート出てきたら、面倒だなぁ。
    // string | string[] | undefined　の可能性があるので、全パターン対応しておく。。
    let pathname = "";
    const { dir } = router.query;
    if (dir !== undefined) {
      if (Array.isArray(dir)) {
        pathname = dir[0]; //配列だったら先頭を利用。
      } else {
        pathname = dir;
      }
    } else {
      if (router.pathname === "/") {
        pathname = "home";
      } else {
        if (router.pathname[0] === "/") {
          // 先頭の"/”を除外。
          pathname = router.pathname.slice(1);
        }
      }
    }

    // dbのviewを更新。
    fetch("/api/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dir: pathname }),
    });

  }, [router.pathname]);

  // /login /admin等、自分がアクセスするサイトはGA除外する。
  if (router.pathname === "/login" || router.pathname === "/admin") {
    console.log("admin or login")
    return <Component {...pageProps} />;
  }

  // GAで開発中のページも集計されてしまうので追加。
  // NODE_ENVがproduction以外の場合、GAタグを設定しない。
  if (process.env.NODE_ENV !== "production") {
    return <Component {...pageProps} />;
  }

  // NODE_ENVがproductionの場合はGAタグを設定
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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
