/**
 * Google Adsense用Scriptコンポーネント
 */

export default function Adsense() {

  // productionでない場合は設定しない
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5798674593050703"
      crossOrigin="anonymous"
    />
  );
}