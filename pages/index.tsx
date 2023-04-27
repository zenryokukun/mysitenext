import Image from "next/image";
import MyHead from "../component/MyHead";
import Menu from "../component/Menu";
import { MODE } from "../component/constants";
import Footer from "../component/Footer";
import Layout, { Main, Side } from "../component/layouts/sidebar/Layout";
import { FancyBlogLinks } from "../component/BlogLinks";
import Twitter from "../component/Twitter";
import { newBlogs } from "../lib/db/extract";
import { blogInfoToLinkItem, productionToLinkItems } from "../lib/typecast";
import productionList from "../lib/prod-list";

import type { LinkItem } from "../types";

import styles from "/styles/Home.module.css";

interface Prop {
  newBlogLinks: LinkItem[];
  prodLinks: LinkItem[];
}

export default function Page({ newBlogLinks, prodLinks }: Prop) {
  const desc = `プログラミングで一人で何かを作りたいけど、困っている方へ。\
私自身、このサイトや仮想通貨の自動取引BOTなどを作っていますが、実装やパッケージの理解で苦労することがよくあります。\
ブログ記事や製作物を通じて、同じところでつまずいた時の助けになるような、役立つ情報を提供します。\
実践的なチュートリアルやエラー解決方法、完成した作品などを掲載していますので、是非、ご覧ください。\
  `;
  return (
    <>
      <MyHead
        title="全力君。"
        metaDescription={desc}
      />
      <Menu iniMode={MODE.HOME}></Menu>
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
      <Footer></Footer>
    </>
  );
}

export async function getStaticProps() {

  const news = await newBlogs(3);
  const prods = await productionList();

  // データが取れない場合は404ページを返す。
  if (!prods || !news) {
    return {
      notFound: true,
    }
  }

  const newBlogLinks = news.map(blogInfoToLinkItem);
  const prodLinks = prods.map(productionToLinkItems);

  return {
    props: {
      newBlogLinks,
      prodLinks: prodLinks.slice(0, 3),
    }
  }
}