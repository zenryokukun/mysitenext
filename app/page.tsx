// Components
import Image from "next/image";
import Navigation from "../component/Navigation";
import Footer from "../component/Footer";
import Layout, { Main, Side } from "../component/layouts/sidebar/Layout";
import { FancyBlogLinks } from "../component/BlogLinks";
import Twitter from "../component/Twitter";
// Other data
import { MODE } from "../component/constants";
import styles from "/styles/Home.module.css";

// logics used in `getProps`
import { newBlogs } from "../lib/db/extract";
import productionList from "../lib/prod-list";
import { assetsRecToLinkItem, productionToLinkItems } from "../lib/typecast";
import { LinkItem } from "../types";

/**
 * `fetch`代替。ssgしてくれる想定。
 * 直近ブログ記事と製作物を取得して返す。
 * @returns [直近ブログ、製作物]
 */
async function getProps(): Promise<[LinkItem[], LinkItem[]]> {
  // 直近記事を３つ取得
  const newsProm = newBlogs(3);
  // 製作物一覧を取得。
  const prodsProm = productionList();
  // 両方resolveするのを待つ。
  const [news, prods] = await Promise.all([newsProm, prodsProm]);
  // undefined時はエラーにする
  if (news === undefined || prods === undefined) {
    throw new Error("failed to fetch Props: `news` or `prods`");
  }
  // LinkItem型に変換
  const newBlogLinks = news.map(assetsRecToLinkItem);
  const prodLinks = prods.map(productionToLinkItems);
  // prodLinksの数を直近記事数に揃える。
  return [newBlogLinks, prodLinks.slice(0, 3)];
}

export default async function Page() {
  const [newBlogLinks, prodLinks] = await getProps();
  return (
    <>
      <Navigation iniMode={MODE.HOME} />
      <aside className={styles.bgimage}>
        <section className={styles.catchWrapper}>
          <div className={styles.catchHeader}>Zen-Production</div>
          <div className={styles.catchMessage}>
            孤独に、一人で作ろう。
          </div>
        </section>
      </aside>
      <Layout>
        <Main>
          <section className={styles.messageWrapper}>
            <h1 className={styles.heading}>一人で作ることの苦楽を共有したい</h1>
            <p>
              プログラミング、建築、動画、音楽、プラモデル、、、規模の大小、質の高低、技術の新旧を問わず、何かを作ることはとても楽しい作業です。
              同時に、成果物として完成させるためには、知識や技術だけでなく、時には創造力や資金力も求められることもあり、様々な苦しさが伴うことも事実です。
              一人でやろうとしている場合、初めの段階でこのようなハードルが高く見えてしまい、楽しさを感じられる前に心を折られてしまうことも
              あるかもしれません。
            </p>
            <p>
              当サイトは、私一人で作っています。趣味で楽しく作業していますが、時には思ったように実装出来ない機能があったり、ドキュメントを見ても理解できないパッケージが
              あったり、苦しい場面も経験してきました。
            </p>
            <p>
              私と同じように、『何かを作ってみたい』という熱意を持った方が、つまずきそうになった時に参考に出来るような情報を、拙いながらも私の製作の経験を通して発信していきたいと思っています。
              一人で進む孤独に対して、少しばかりの慰めとなれば幸いです。
            </p>

            <h2 className={styles.secondHeading}>プログラミングについて</h2>
            <p>
              私は趣味でプログラムを書いています。当サイトの他に、仮想通貨やFXの自動取引BOT等を
              作っています。そのため、プログラミングに関するトピックが中心となります。
            </p>
            <p>
              プログラミング言語に関するチュートリアルは、インターネット上に多数の優良なコンテンツが
              あり、基礎的な内容であれば、学習のハードルはそこまで高くないと思います。
              私の場合で言うと、むしろ基礎を抑えた後、何かを作ろうとした時に「どういうパッケージやサービスを使えば良いのか」
              悩むことが多いです。もしくは、そもそも何を作ればよいのか、アイデアが浮かばないということもあります。
            </p>
            <p>
              同じところで悩まれる方へのガイダンスとして、ブログでは私が実際に使ったパッケージ等の
              解説や、その過程で生じたエラーやその解消方法を中心に記事にしていきます。そして、アイデアの
              共有として、実際に作った成果物も公開していきます。
            </p>
            <div className={styles.underline}></div>
          </section>

          <section className={styles.linkSection}>
            <h2 className={styles.linkTitle}>直近の製作物</h2>
            <div className={styles.linkArea}>
              <div className={styles.linkWrapper}>
                <FancyBlogLinks addStyle={styles.addLink} data={newBlogLinks} headline="最新記事" showSummary={true} />
              </div>
              <div className={styles.linkWrapper}>
                <FancyBlogLinks addStyle={styles.addLink} data={prodLinks} headline="最新成果物" showSummary={true} />
              </div>
            </div>
          </section>
        </Main>
        <Side>
          <section>
            <div className={styles.birdTitle}>作者の別の趣味（野鳥）</div>
            <div className={styles.birdSection}>
              <figure className={styles.birdImageWrapper}>
                <div className={styles.birdImage}>
                  <Image
                    src="/home/jou-female.jpg"
                    alt="jou-bitaki-bird"
                    width={130} height={130} />
                </div>
                <figcaption>ジョウビタキ♀</figcaption>
              </figure>
              <figure className={styles.birdImageWrapper}>
                <div className={styles.birdImage}>
                  <Image
                    src="/home/kawasemi.jpg"
                    alt="kawasemi-bird"
                    width={130} height={130}
                  />
                </div>
                <figcaption>カワセミ</figcaption>
              </figure>
              <figure className={styles.birdImageWrapper}>
                <div className={styles.birdImage}>
                  <Image
                    src="/home/swallow.jpg"
                    alt="swallow-bird"
                    width={130} height={130}
                  />
                </div>
                <figcaption>ツバメ</figcaption>
              </figure>
              <figure className={styles.birdImageWrapper}>
                <div className={styles.birdImage}>
                  <Image
                    src="/home/mozu.jpg"
                    alt="mozu-bird"
                    width={130} height={130}
                  />
                </div>
                <figcaption>モズ</figcaption>
              </figure>
            </div>
          </section>
          <Twitter />
        </Side>
      </Layout>
      <Footer />
    </>
  );
}