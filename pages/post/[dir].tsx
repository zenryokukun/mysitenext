import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import { MODE } from "../../component/constants";
import { getBlogDirList } from "../../lib/db/func"
import { getBlogMd, formatMd, toHTMLString } from "../../lib/util";
import { useState } from "react";
import styles from "../../styles/Post.module.css";


interface PostProp {
  content: string,
  /**
   * 当面、data:{title:string,author:string}のを想定。
   */
  data: {
    [key: string]: string,
  }
}

interface PathProp {
  params: { dir: string }
}

/**
 * {content}部分のスタイルシートは全てglobals.cssに記載。
 */
export default function Post({ content, data }: PostProp) {
  const title = data.title || "全力君";
  return (
    <>
      <MyHead title={title}></MyHead>
      <Menu iniMode={MODE.BLOG}></Menu>
      <article
        className={styles.container}
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>
      <Like></Like>
      <Footer offset="offsetTopL"></Footer>
      {/* <Footer></Footer> */}
    </>
  );
}

function Like() {
  const [isHighLight, setHighLight] = useState(false);
  const [isClicked, setClicked] = useState(false);
  const enter = (e: React.MouseEvent<HTMLDivElement>) => setHighLight((isHightLight) => !isHighLight);
  const leave = (e: React.MouseEvent<HTMLDivElement>) => setHighLight((isHightLight) => !isHighLight);
  const click = (e: React.MouseEvent<HTMLDivElement>) => setClicked(true);
  let color = styles.primary;
  if (isClicked) {
    color = styles.accent;
  } else {
    color = isHighLight ? styles.accent : styles.primary;
  }
  return (
    <div className={styles.likeWrapper}>
      <div className={`${styles.thanks} ${color}`}>
        {isClicked ? '"いいね"ありがとうございます！！' : '最後までありがとうございます。"いいね"も下さい。'}
      </div>
      <div className={styles.iconWrapper} onMouseEnter={enter} onMouseLeave={leave} onClick={click}>
        <i className={`fa-solid fa-heart fa-2x ${styles.like} ${color}`}></i>
      </div>
    </div>
  );
}

export async function getStaticProps({ params }: PathProp) {
  const { dir } = params;
  const mdData = await getBlogMd(dir);
  const fmtData = formatMd(mdData);
  const content = await toHTMLString(fmtData.content);
  const { data } = fmtData; // mdのyamlメタデータ部分
  return {
    props: { content, data },
  }
}

export async function getStaticPaths() {
  const docs = await getBlogDirList();
  const paths = docs.map(doc => {
    return { params: { dir: doc["assetsDir"] } }
  });

  return {
    paths,
    fallback: false,
  };
}
