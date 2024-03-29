// App専用 component
import GA from "./component/GA"
import JSON_LD from "./component/JSON-LD";
import Adsense from "./component/Adsense";

// その他
import "./globals.css";
import type { Metadata } from "next";

// font-awesomeのNext.js対策。ページ単位でやるの面倒なので、ここで全ページ適用にしちゃう。
// 詳細：https://fontawesome.com/v5/docs/web/use-with/react
// import { config } from "@fortawesome/fontawesome-svg-core";
// import '@fortawesome/fontawesome-svg-core/styles.css'
// config.autoAddCss = false;

// 適宜各Page.tsxでOverride。
export const metadata: Metadata = {
  title: "全力君。",
  description: "プログラミングで一人で何かを作りたいけど、困っている方へ。私自身、このサイトや仮想通貨の自動取引BOTなどを作っていますが、実装やパッケージの理解で苦労することがよくあります。私の経験を共有し、同じところでつまずいた時の助けになるような、役立つ情報を発信します。是非ご覧ください。",
  openGraph: {
    type: "website",
    title: "全力君",
    url: "https://www.zenryoku-kun.com/",
  },
  twitter: {
    site: "@zenryoku_kun0",
    title: "全力君のZen-Production",
    description: "独学者の独学者による独学者のためのサイト",
  },
  metadataBase: process.env.NODE_ENV === "production" ? new URL("https://www.zenryoku-kun.com") : new URL("https://localhost:3000"),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // <html lang="ja">
    <html lang="ja">
      <GA />
      <body>
        <JSON_LD />
        <Adsense />
        {children}
      </body>
    </html>
  );
}