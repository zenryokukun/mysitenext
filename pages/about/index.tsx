import Image from "next/image";
import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import { MODE, LINK } from "../../component/constants";

import styles from "../../styles/About.module.css";

/**Description About Page */

export default function AboutPage() {

  return (
    <>
      <MyHead
        title="このサイトについて"
        metaDescription="このサイトの目的や作者情報、連絡先について記載します。"
        useBreadCrumb={true}
      />
      <Menu iniMode={MODE.ABOUT}></Menu>
      <About></About>
      <Footer></Footer>
    </>
  );
}


function About() {
  // const titles: string[] = ["About This Site", "About The Author", "Likes.."];
  // const texts: string[] = [
  //   `このサイトは個人が作成したものです。プログラミングを独学しようという方、とりわけ、職業的エンジニアを目指すような方でなく、
  //   純粋に何か作ってみたいと興味を持っている方向けに、簡単な技術記事や、モチベーションに繋がるような製作物の紹介をします。その他、趣味に関する記事も投稿していきます。
  //   インターネットの世界を、SEO対策で似通ってしまった記事や、大企業のクリーンでエコロジカルなサイトの集合体にするのではなく、
  //   インターネット黎明期のような、個人の独創性、情熱、例え不正確でも主観的な考察に満ちたものにするのが私の目標です。そのために、
  //   我々は個人は、それぞれのセンスをエキセントリックに研ぎ澄ましていかなければなりません。その一助となればと思い立ち上げたサイトです。

  //   `,

  //   `金融業界で働く中年です。中産階級の家庭で生まれ育ち、私自身プロレタリアートとして業界に10数年身をおいています。気弱で人畜無害な性格です。
  //   経済学学士、私大卒文系です。プログラミングは、ニコニコ動画でオセロをJavascriptで作成する動画を見て興味をもち、以来私の長い趣味になっています。
  //   サイト公開まで辿り着けましたが、まだまだ技術面では表現力が足りないと感じており、今後も様々なものを試していきたいと思っています。
  //   その他、野鳥をこよなく愛し、時間があれば探しにいき写真を撮っています。
  //   `,
  // `気が付けば、会社に勤めて10年以上。長い間組織の意思の基に行動し、
  // 自らの考えや感性は希薄になってきたように感じます。
  // 組織視点の効率性や合理性より、人としての正しさを追及すべきではないのか？
  // そう思いつつ漫然と日々を過ごし、いつの間にか自分が良く分からなくなってしまいました。`,

  // `普段自分が行っていること、ふと思ったことを人に伝える機会がありませんので、文明の力を借りて、ここに記していきたいと思います。
  // 初めは就職してから今にいたるまでの旅行記を中心に展開します。趣味はプログラムを作ることですので、出来が悪くてもなるべく
  // 形に残るよう、ここにリンクを貼っていきます。Homeは電波が飛んでいますが、案外気さくな人間なので気軽に絡んでください。`,
  // ];
  // const likes: string[] = [
  //   "生姜、ミョウガ、九条葱、柚子胡椒",
  //   "駅そば・うどん",
  //   "電車、神社仏閣、田舎駅"
  // ];

  return (
    <>
      <h1 className={styles.header}>このサイトについて</h1>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Image src="/about/hakata.jpg" alt="" width={600} height={700} style={{ "width": "100%", "height": "100%" }} />
        </div>
        <section className={`${styles.wrapper} ${styles.textContent}`}>
          <h3 className={styles.title}>
            <div>
              <i className={`fa-solid fa-torii-gate ${styles.icon}`}></i>
              About This Site
            </div>
          </h3>
          <p>このサイトは個人が作成したものです。プログラミングを独学しようという方、とりわけ、職業的エンジニアを目指すような方でなく、
            純粋に何か作ってみたいと興味を持っている方向けに、簡単な技術記事や、モチベーションに繋がるような製作物の紹介をします。その他、趣味に関する記事も投稿していきます。
          </p>
          <p>
            インターネットの世界を、SEO対策で似通ってしまった記事や、大企業のクリーンでエコロジカルなサイトの集合体にするのではなく、
            インターネット黎明期のような、個人の独創性、情熱、例え不正確でも個人の考察に満ちたものにするのが私の目標です。そのために、
            我々は個人は、それぞれのセンスをエキセントリックに研ぎ澄ましていかなければなりません。その一助となればと思い立ち上げたサイトです。
          </p>
        </section>
        <div className={styles.wrapper}>
          <Image src="/about/hakodate.jpg" alt="" width={600} height={700} style={{ "width": "100%", "height": "100%" }} />
        </div>
        <section className={`${styles.wrapper} ${styles.textContent}`}>
          <h3 className={styles.title}>
            <div>
              <i className={`fa-solid fa-poo ${styles.icon}`}></i>
              About The Author
            </div>
          </h3>
          <p>全力君と申します。金融業界で働く中年です。経済学学士、私大卒文系です。プログラミングは、ニコニコ動画でオセロをJavascriptで作成する動画を見て興味をもち、以来私の長い趣味になっています。
            サイト公開まで辿り着けましたが、まだまだ技術面では表現力が足りないと感じており、今後も様々なものを試していきたいと思っています。
            サイトの他には、仮想通貨やFXの自動取引botの作成をしています。取引結果は<a href={LINK.TWITTER2}>Twitter</a>で自動ツイートしているので、ぜひフォローしてください。
          </p>
          <p>
            その他、野鳥をこよなく愛し、時間があれば探しにいき写真を撮っています。
          </p>
        </section>
        <div className={styles.wrapper}>
          <Image src="/about/yashima.jpg" alt="" width={600} height={700} style={{ "width": "100%", "height": "100%" }} />
        </div>
        <section className={`${styles.wrapper} ${styles.textContent}`}>
          <h3 className={styles.title}>
            <div>
              <i className={`fa-solid fa-address-card ${styles.icon}`}></i>
              Contact
            </div>
          </h3>
          <p>本サイト内で、誤った情報、不適切な内容がある場合はメールかTwitterでご連絡ください。確認の上、可能な限り対応します。要望なども歓迎です。</p>
          <ul className={styles.links}>
            <li className={styles.item}><a href={"mailto:" + LINK.MAIL}><i className={`fa-solid fa-envelope ${styles.prs}`}></i>Mail</a></li>
            <li className={styles.item}><a href={LINK.TWITTER}><i className={`fa-brands fa-twitter ${styles.prs}`}></i>Twitter</a></li>
          </ul>
          <p>
            他のSNSアカウントです。こちらのTwitterは自動取引の結果を自動ツイートしています。
            Instagramはあまり活動できていませんが、主に野鳥や旅行の写真を投稿していく予定です。
          </p>
          <ul className={styles.links}>
            <li className={styles.item}><a href={LINK.TWITTER2}><i className={`fa-brands fa-twitter ${styles.prs}`}></i>Twitter(bot)</a></li>
            <li className={styles.item}><a href={LINK.INSTAGRAM}><i className={`fa-brands fa-instagram ${styles.prs}`}></i>Instagram</a></li>
          </ul>
        </section>

      </div>
    </>
  );
}