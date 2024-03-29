
/**
 * Amazonアソシエイトリンクのコンポーネント
 * パラメタのurlはAmazonアソシエイトツールで生成したhtmlのsrc部分
 * 指定しない場合はデフォルトの広告。ankerのtype x c-type-cケーブル

 */
export function Amazon({ src }: { src?: string }) {
  const linkSrc = src || "//rcm-fe.amazon-adsystem.com/e/cm?lt1=_blank&bc1=000000&IS2=1&bg1=FFFFFF&fc1=000000&lc1=0000FF&t=zenryokukun-22&language=ja_JP&o=9&p=8&l=as4&m=amazon&f=ifr&ref=as_ss_li_til&asins=B083449XCC&linkId=b178372e3c221d1c9b6a878142dc20ba"
  return (
    <iframe
      sandbox="allow-popups allow-scripts allow-modals allow-forms allow-same-origin"
      style={{
        display: "block",
        width: "120px", height: "240px",
        margin: "0 auto",
        border: "0",
        overflow: "visible",
      }}
      // こちらはAmazonでリンクを自動生成すると追加される属性。全て非推奨属性のため、CSSに移行。
      // marginWidth={0}
      // marginHeight={0}
      // scrolling="no"
      // frameBorder={0}
      src={linkSrc}
      // for accessbility
      title="Ad for Amazon"
    />
  );
}

export default function ({ src }: { src?: string }) {
  return (
    <section>
      <div style={{
        textAlign: "center",
        fontSize: "1.1rem",
        fontWeight: "bold",
        borderBottom: "1px solid darkgray",
        marginBottom: "1rem"
      }}>広告</div>
      <Amazon src={src} />
    </section >
  )
}