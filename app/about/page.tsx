import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faToriiGate, faPoo, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import { LINK } from "../../component/constants";
import styles from "../../styles/About.module.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "このサイトについて",
  description: "このサイトの目的や作者情報、連絡先について記載します。",
}

export default function Page() {
  return (
    <>
      <h1 className={styles.header}>このサイトについて</h1>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Image
            src="/about/hakata.jpg"
            sizes="(max-width:850px) 100vw,(max-width:1200px) 50vw,33vw"
            alt=""
            width={600} height={700}
            priority
            className={styles.nextPic}
          />
        </div>
        <section className={`${styles.wrapper} ${styles.textContent}`}>
          <h3 className={styles.title}>
            <div>
              {/* <i className={`fa-solid fa-torii-gate ${styles.icon}`}></i> */}
              <FontAwesomeIcon icon={faToriiGate} className={styles.icon} />
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
          <Image
            src="/about/hakodate.jpg"
            sizes="(max-width:850px) 100vw,(max-width:1200px) 50vw,33vw"
            alt="" width={600} height={700}
            priority
            className={styles.nextPic}
          />
        </div>
        <section className={`${styles.wrapper} ${styles.textContent}`}>
          <h3 className={styles.title}>
            <div>
              {/* <i className={`fa-solid fa-poo ${styles.icon}`}></i> */}
              <FontAwesomeIcon icon={faPoo} className={styles.icon} />
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
          <Image
            src="/about/yashima.jpg"
            sizes="(max-width:850px) 100vw,(max-width:1200px) 50vw,33vw"
            alt=""
            width={600} height={700}
            className={styles.nextPic}
            priority
          />

        </div>
        <section className={`${styles.wrapper} ${styles.textContent}`}>
          <h3 className={styles.title}>
            <div>
              {/* <i className={`fa-solid fa-address-card ${styles.icon}`}></i> */}
              <FontAwesomeIcon icon={faAddressCard} className={styles.icon} />
              Contact
            </div>
          </h3>
          <p>本サイト内で、誤った情報、不適切な内容がある場合はメールかTwitterでご連絡ください。確認の上、可能な限り対応します。要望なども歓迎です。</p>
          <ul className={styles.links}>
            {/* <li className={styles.item}><a href={"mailto:" + LINK.MAIL}><i className={`fa-solid fa-envelope ${styles.prs}`}></i>Mail</a></li> */}
            <li className={styles.item}>
              <a href={"mailto:" + LINK.MAIL}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.prs} />
                Mail
              </a>
            </li>
            {/* <li className={styles.item}><a href={LINK.TWITTER}><i className={`fa-brands fa-twitter ${styles.prs}`}></i>Twitter</a></li> */}
            <li className={styles.item}>
              <a href={LINK.TWITTER}>
                <FontAwesomeIcon icon={faTwitter} className={styles.prs} />
                Twitter
              </a>
            </li>
          </ul>
          <p>
            他のSNSアカウントです。こちらのTwitterは自動取引の結果を自動ツイートしています。
            Instagramはあまり活動できていませんが、主に野鳥や旅行の写真を投稿していく予定です。
          </p>
          <ul className={styles.links}>
            {/* <li className={styles.item}><a href={LINK.TWITTER2}><i className={`fa-brands fa-twitter ${styles.prs}`}></i>Twitter(bot)</a></li> */}
            <li className={styles.item}>
              <a href={LINK.TWITTER2}>
                <FontAwesomeIcon icon={faTwitter} className={styles.prs} />
                Twitter(bot)
              </a>
            </li>
            {/* <li className={styles.item}><a href={LINK.INSTAGRAM}><i className={`fa-brands fa-instagram ${styles.prs}`}></i>Instagram</a></li> */}
            <li className={styles.item}>
              <a href={LINK.INSTAGRAM}>
                <FontAwesomeIcon icon={faInstagram} className={styles.prs} />
                Instagram
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}