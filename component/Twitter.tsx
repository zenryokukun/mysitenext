/**
 * SideBarLayoutのSidePartに表示させる、TwitterタイムラインのComponent。
 * 追ってcssを多少カスタム出来るようにレイアウトから分離させた。
 * レイアウトから切り離したため、レスポンシブ対応発動時の幅を変更する場合は、
 * レイアウトとこのComponentのcssそれぞれ修正が必要になるので留意。
 */


import Script from "next/script";
// import { useEffect } from "react";
import styles from "./Twitter.module.css";

interface TwitterP {
  width?: number,
  height?: number,
}

export default function Twitter({ width = 300, height = 700 }: TwitterP) {

  // useEffect(() => {
  //   // twitterタイムラインのウィジェットのscriptタグを読み取る。
  //   const js = document.createElement("script");
  //   js.setAttribute("src", "https://platform.twitter.com/widgets.js");
  //   document.body.appendChild(js);
  //   // この行はよく分からないがtwitter apiのドキュメントにあったので入れた。
  //   (globalThis as any).twttr?.widgets?.load();
  //   return (() => js.remove());
  // }, []);

  return (
    <section className={styles.container}>
      <Script src="https://platform.twitter.com/widgets.js" strategy="lazyOnload"></Script>
      <a className="twitter-timeline" data-width={width} data-height={height} data-theme="light" href="https://twitter.com/zenryoku_kun0?ref_src=twsrc%5Etfw">Tweets by zenryoku_kun0</a>
    </section>
  );
}