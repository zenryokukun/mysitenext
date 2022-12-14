import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import { MODE } from "../../component/constants";
import styles from "../../styles/Production.module.css";

/**
 * Description 成果物Page 
 * TODO
 *  - 成果物が増えたらデータをベタ打ちでなくDBに登録することを検討。
 * 
 */

interface Prop {
  title: string,
  summary: string,
  href: string,
  imgClass: string,
  imgPath: string,
  alt: string,
}

export default function Production() {

  const mdCvt = {
    title: "MD-Converter",
    summary: "MDを簡単に見やすくするために、簡易なCSS込みでHTMLに変換するサービス。",
    href: "/production/md-converter", // /pages/minesweeper のほう
    imgClass: styles.fill,
    imgPath: "/production/markdown.svg", // /public/production/minesweeper のほう
    alt: "markdown-logo",
  };

  const mskai = {
    title: "マインスイーパー・改",
    summary: "未到達のレベルを引っ提げて、やつは再び現れる...その名は『地雷を撤去せし者・改』。『極（KI・WA・MI）』レベルを追加し、内部の作りを変えました。スマホ未対応。",
    href: "/production/minesweeperkai", // /pages/minesweeper のほう
    imgClass: styles.fill,
    imgPath: "/production/minesweeper/mskai.png", // /public/production/minesweeper のほう
    alt: "minesweeper-game",
  };

  const minesweeper = {
    title: "Minesweeper",
    summary: "嘗て古のOSに搭載され、時代の流れとともにひっそりと姿を消した伝説のGAME。その名は、、、『地雷を撤去せし者』。スマホ未対応。",
    href: "/production/minesweeper", // /pages/minesweeper のほう
    imgClass: styles.fill,
    imgPath: "/production/minesweeper/ms-prod.png", // /public/production/minesweeper のほう
    alt: "minesweeper-game",
  }

  const genki = {
    title: "元気玉"
    , summary: "仮想通貨取引所。たとえ見た目はしょぼくても、私の知りうる全てを注ぎ込みました。\
                まさにブリーディングでカッティングなエッジ、正真正銘のフラッグシップなのであります。\
                私をお金持ちにしてください。"
    , href: "/html/genkidama/index.html"
    , imgClass: styles.fill
    , imgPath: "/production/genki.png"
    , alt: "genkidama"
  };

  const marimo = {
    title: "MARIMO"
    , summary: "マリモがノコノコやクリボーをつぶしてコインを取るだけのゲーム。PCオンリーです。"
    , href: "/html/marimo/index.html"
    , imgClass: styles.fill
    , imgPath: "/production/mario.png"
    , alt: "marimo"
  };

  const cropper = {
    title: "スマホ画像切取君"
    , summary: "スマホの縦長画像を9:16,2:3,3:2,1:1いずれかのアスペクト比で適当に切り取ってくれます。"
    , href: "html//cropper/index.html"
    , imgClass: styles.fill
    , imgPath: "/production/cropper.png"
    , alt: "cropper"
  };

  return (
    <>
      <MyHead title="作品物"></MyHead>
      <Menu iniMode={MODE.PRODUCTION}></Menu>
      <main className={styles.container}>
        <Product {...mdCvt}></Product>
        <Product {...mskai}></Product>
        <Product {...minesweeper}></Product>
        <Product {...marimo}></Product>
        <Product {...cropper}></Product>
        <Product {...genki}></Product>

      </main>
      <Footer></Footer>
    </>
  );
}

function Product({ title, summary, href, imgClass, imgPath, alt }: Prop) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imgWrapper}>
        <img className={imgClass} src={imgPath} alt={alt} />
      </div>
      <div className={styles.info}>
        <h1 className={styles.title}>
          <a href={href}>{title}</a>
        </h1>
        <p className={styles.summary}>{summary}</p>
      </div>
    </div>
  );
}