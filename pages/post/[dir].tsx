import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import { MODE } from "../../component/constants";
import { getBlogDirList } from "../../lib/db/func"
import { getBlogMd, formatMd, toHTMLString } from "../../lib/util";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../../styles/Post.module.css";

/**Description ブログ記事Page */


/**
 * getStaticPropsの戻り値。default exportの引数として呼ばれる。
 * {props:{content:string,data:{title:string,author:string,...}}}
 * 
 * 当面、data:{title:string,author:string}のを想定。
 */
interface PostProp {
  content: string,
  data: {
    [key: string]: string,
  }
}

// getStaticPropsの引数。
// dynamic routeのファイル名:dir
interface PathProp {
  params: { dir: string }
}

// like component
interface LikeProp {
  isClicked: boolean, // いいねがクリックされているか
  likeClick: () => void, // いいねをクリックした時の関数
}

const ENDPOINT = "/api/post/like";

/**
 * {content}部分のスタイルシートは全てglobals.cssに記載。
 */
export default function Post({ content, data }: PostProp) {

  const router = useRouter();
  const [likeClicked, setLike] = useState(false);
  const click = () => setLike(() => !likeClicked);
  // dataにタイトルが設定されていない場合、"全力君"を設定
  const title = data.title || "全力君";

  // いいね　が押されていたらDBを更新。ページを離れる時に呼び出す。
  const updateLike = () => {
    if (likeClicked) {
      const query = router.query // {dir:'201202_1'}
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      }).then(raw => raw.text()).then(text => console.log(text));
    }
  };

  // ページを離れる時、いいねが押されていればDB更新したい。
  // mount時、unmount時、likeClickedが変更されると呼ばれるので、
  // routeChangeStartの中に更新処理を入れている。
  useEffect(() => {
    // 呼ばれる都度イベント設定
    router.events.on("routeChangeStart", updateLike);
    // unmount時はイベントはずす
    return () => router.events.off("routeChangeStart", updateLike);
  }, [likeClicked])

  return (
    <>
      <MyHead title={title}></MyHead>
      <Menu iniMode={MODE.BLOG}></Menu>
      <Link href="/blog">
        <a className={styles.back}>記事一覧に戻る</a>
      </Link>
      <article
        className={styles.container}
        dangerouslySetInnerHTML={{ __html: content }}
      ></article>
      <Like isClicked={likeClicked} likeClick={click}></Like>
      <Link href="/blog">
        <a className={styles.back}>記事一覧に戻る</a>
      </Link>
      <Footer></Footer>
    </>
  );
}

// いいねComponent
function Like({ isClicked, likeClick }: LikeProp) {
  const [isHighLight, setHighLight] = useState(false);
  const [color, setColor] = useState(styles.primary);
  // mousehoverをcssでなくjsで再現
  const enter = (e: React.MouseEvent<HTMLDivElement>) => setHighLight(true);
  const leave = (e: React.MouseEvent<HTMLDivElement>) => setHighLight(false);
  const click = (e: React.MouseEvent<HTMLDivElement>) => likeClick();

  // mount時、unmount時、mousehover時に実行。iconの色反転に使う
  useEffect(() => {
    if (isClicked) {
      setColor(styles.accent);
    } else {
      let _color = styles.primary;
      _color = isHighLight ? styles.accentOnHover : styles.primary;
      setColor(_color);
    }
  }, [isClicked, isHighLight]);

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

// dynamic routeの一覧を取得。dbからblogのdirのみを抽出。
// pathsを操作して1件ずつgetStaticPropsが実行される仕様。
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
