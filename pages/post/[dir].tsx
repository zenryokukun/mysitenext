import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import SideBar from "../../component/Post/SideBar";
import Like from "../../component/Post/Like";
import { MODE } from "../../component/constants";
import { getBlogDirList } from "../../lib/db/func"
import { getBlogMd, formatMd, toHTMLString } from "../../lib/util";
import breadCrumbsJSON from "../../lib/bread";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import Link from "next/link";

import type { HeadProp } from "../../types";
import styles from "../../styles/Post.module.css";

/*
 *　Description ブログ記事Page
 */

interface DataProp extends HeadProp {
  author?: string, // 作者名。サイドバーに表示
  postedDate?: string, // 投稿日YYYY/MM/DD。サイドバーに表示
}

/**
 * getStaticPropsの戻り値。default exportされるPageの引数として呼ばれる。  
 * ブログ用mdファイルをfront-matter部分とmd部分に分割したデータがpropsとして渡される。  
 * props.content -> md部分をhtml文字列化したデータ  
 * props.data:HeadProp -> front-matter部分のデータ  
 */
interface PostProp {
  content: string,
  data: DataProp,
  // data: {
  //   [key: string]: string,
  // }
}

// getStaticPropsの引数。
// dynamic routeのファイル名:dir
interface PathProp {
  params: { dir: string }
}

// 「いいね」更新用エンドポイント
const ENDPOINT = "/api/post/like";

// パンくずjson-ldを取得する関数
function genJsonLd(router: NextRouter) {
  const base = router.asPath.split("/").slice(-1)[0];
  const items = [
    { name: "home", item: "https://www.zenryoku-kun.com/" },
    { name: "blog", item: "https://www.zenryoku-kun.com/blog" },
    // 最後のitemにもurl追加。そうしたほうが良いとのこと（chatGPT）。
    { name: base, item: "https://www.zenryoku-kun.com/post/" + base },
  ];
  const jsonld = breadCrumbsJSON(items);
  return jsonld;
}

/**
 * {content}部分のスタイルシートは全てglobals.cssに記載。
 */
export default function Post({ content, data }: PostProp) {

  const router = useRouter();

  // パンくずリストJSON-ld
  const bcJsonLd = genJsonLd(router);

  const [likeClicked, setLike] = useState(false);
  const click = () => setLike(() => !likeClicked);

  let { author, postedDate } = data;
  author = author || "全力君";
  postedDate = postedDate || "2022年";

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
      <MyHead {...data} breadCrumbsJSON_ld={bcJsonLd}></MyHead>
      <Menu iniMode={MODE.BLOG}></Menu>
      <div className={styles.wrapper}>
        <main className={styles.mainContainer}>
          <Link href="/blog">
            <a className={styles.back}>記事一覧に戻る</a>
          </Link>
          <article
            className={styles.articleContainer}
            dangerouslySetInnerHTML={{ __html: content }}
          ></article>
          <Like isClicked={likeClicked} likeClick={click}></Like>
          <Link href="/blog">
            <a className={styles.back}>記事一覧に戻る</a>
          </Link>
        </main>
        <SideBar author={author} postedDate={postedDate} />
      </div>
      <Footer></Footer>
    </>
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
