/**
 * Aboutページのコンポーネント。/pages/about/index.tsxに移植済みのため、
 * 現在は使われていない。手当は不要。
 */

import styles from "../styles/About.module.css";
import Image from "next/image";

export default function About() {
  const titles: string[] = ["Introduction", "Motivation", "Likes.."];
  const texts: string[] = [
    `気が付けば、会社に勤めて10年以上。長い間組織の意思の基に行動し、
    自らの考えや感性は希薄になってきたように感じます。
    組織視点の効率性や合理性より、人としての正しさを追及すべきではないのか？
    そう思いつつ漫然と日々を過ごし、いつの間にか自分が良く分からなくなってしまいました。`,

    `普段自分が行っていること、ふと思ったことを人に伝える機会がありませんので、文明の力を借りて、ここに記していきたいと思います。
    初めは就職してから今にいたるまでの旅行記を中心に展開します。趣味はプログラムを作ることですので、出来が悪くてもなるべく
    形に残るよう、ここにリンクを貼っていきます。Homeは電波が飛んでいますが、案外気さくな人間なので気軽に絡んでください。`,
  ];
  const likes: string[] = [
    "生姜、ミョウガ、九条葱、柚子胡椒",
    "駅そば・うどん",
    "電車、神社仏閣、田舎駅"
  ];

  return (
    <div className={styles.container}>
      <img className={styles.wrapper} src="/about/hakata.jpg" alt="torii in hakata" />
      {textContent(titles[0], texts[0])}
      <img className={styles.wrapper} src="/about/hakodate.jpg" alt="torii in hakodate" />
      {textContent(titles[1], texts[1])}
      <img className={styles.wrapper} src="/about/yashima.jpg" alt="torii in yashima" />
      {likeContent(titles[2], likes)}
    </div>
  );
}

function textContent(title: string, text: string) {
  return (
    <div className={`${styles.wrapper} ${styles.textContent}`}>
      <h1 className={styles.title}>{title}</h1>
      <div>{text}</div>
    </div>
  );
}

function likeContent(title: string, lists: string[]) {
  return (
    <div className={`${styles.wrapper} ${styles.textContent}`}>
      <h1 className={styles.title}>{title}</h1>
      <ul>
        {lists.map((txt, i) => <li key={i}>{txt}</li>)}
      </ul>
    </div>
  );
}

/**
import React from "react";
//@ts-ignore
import Image from "./Image.tsx";
// @ts-ignore
import { Cname, Text } from "./intefaces.ts";

const texts = [
  `気が付けば、会社に勤めて10年以上。長い間組織の意思の基に行動し、
    自らの考えや感性は希薄になってきたように感じます。
    組織視点の効率性や合理性より、人としての正しさを追及すべきではないのか？
    そう思いつつ漫然と日々を過ごし、いつの間にか自分が良く分からなくなってしまいました。
    `
  ,
  `
    普段自分が行っていること、ふと思ったことを人に伝える機会がありませんので、文明の力を借りて、ここに記していきたいと思います。
    初めは就職してから今にいたるまでの旅行記を中心に展開します。趣味はプログラムを作ることですので、出来が悪くてもなるべく
    形に残るよう、ここにリンクを貼っていきます。Homeは電波が飛んでいますが、案外気さくな人間なので気軽に絡んでください。
    `
];

class About extends React.Component<{}, { loaded: boolean }> {

  constructor(props: {}) {
    super(props);
    this.state = { loaded: false };
  }

  componentDidMount() {
    this.setState({ loaded: true });
  }

  render(): React.ReactNode {
    const { loaded } = this.state;
    // 画像読込が終わる前にcss animationがはじまるので、componentDidMountしてから見えるようにする。
    let visibleClass = "about"
    if (!loaded) {
      visibleClass += " about__hide"
    }
    return (
      <div className={visibleClass}>
        <Image src="hakata.jpg" alt="torii in hakata" cname="about__wrapper__content about__image" />
        <div className="about__wrapper__content about__text" >
          <h1 className="about__text__title">自己紹介</h1>
          <TextContent cname="about__text--content" text={texts[0]} />
        </div>
        <Image src="hakodate.jpg" alt="torii in hakodate" cname="about__wrapper__content about__image" />
        <div className="about__wrapper__content about__text" >
          <h1 className="about__text__title">目的</h1>
          <TextContent cname="about__text--content" text={texts[1]} />
        </div>
        <Image src="yashima.jpg" alt="torii in kagawa" cname="about__wrapper__content about__image" />
        <div className="about__wrapper__content about__text" >
          <h1 className="about__text__title">好き</h1>
          <ul>
            <li>生姜、ミョウガ、九条葱、柚子胡椒</li>
            <li>駅そば・うどん</li>
            <li>電車、神社仏閣、田舎駅
            </li>
            <li>野鳥</li>
          </ul>
        </div>
      </div>
    );
  }
}

class TextContent extends React.Component<Cname & Text> {
  render(): React.ReactNode {
    const { cname, text } = this.props;
    return <div className={cname}>{text}</div>
  }
}

export default About;
 */