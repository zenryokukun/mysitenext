import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from "react";


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
  return <Component {...pageProps} />
}

export default MyApp
