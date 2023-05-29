import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import Layout, { Main, Side } from "../../component/layouts/sidebar/Layout";
import Author from "../../component/Author";
import Twitter from "../../component/Twitter";
import { FancyBlogLinks } from "../../component/BlogLinks";
import Like from "../../component/Like";
import { MODE } from "../../component/constants";
import { getBlogDirList } from "../../lib/db/func"
import { getBlogMd, formatMd } from "../../lib/util";
import { toHTMLString } from "../../lib/to-html-string";
import { useState, useEffect } from "react";
import { findByDir } from "../../lib/db/extract";
import { blogInfoToLinkItem } from "../../lib/typecast";
import { useRouter } from "next/router";
import Link from "next/link";

import type { HeadProp, LinkItem, BlogInfo } from "../../types";

import styles from "../../styles/Post.module.css";
import { relatedBlogs, newBlogs } from "../../lib/db/extract";

/* ***************************************************
 *　Description ブログ記事Page
 * **************************************************/

/**
 * gray-matterのfront-matter部分の型。
 * HeadPropにauthorとpostedDateを追加している。
 */
interface DataProp extends HeadProp {
  author?: string; // 作者名。サイドバーに表示
  postedDate?: string; // 投稿日YYYY/MM/DD。サイドバーに表示
}

/**
 * getStaticPropsの戻り値。default exportされるPageの引数として呼ばれる。  
 * ブログ用mdファイルをfront-matter部分とmd部分に分割したデータがpropsとして渡される。  
 * props.content -> md部分をhtml文字列化したデータ  
 * props.data:DataProp -> front-matter部分のデータ  
 */
interface PostProp {
  content: string;
  data: DataProp;
  related: LinkItem[];
  latest: LinkItem[];
}

// getStaticPropsの引数。
// dynamic routeのファイル名:dir
interface PathProp {
  params: { dir: string }
}

// 「いいね」更新用エンドポイント
const ENDPOINT = "/api/post/like";

/**
 * {content}部分のスタイルシートは全てglobals.cssに記載。
 */
export default function Post({ content, data, related, latest }: PostProp) {
  const router = useRouter();

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
      <MyHead {...data} useBreadCrumb={true}></MyHead>
      <Menu iniMode={MODE.BLOG}></Menu>
      {/* <div className={styles.wrapper}> */}
      <Layout>
        <Main>
          {/* <main className={styles.mainContainer}> */}
          <Link href="/blog" className={styles.back}>
            記事一覧に戻る
          </Link>
          <article
            className={styles.articleContainer}
            dangerouslySetInnerHTML={{ __html: content }}
          ></article>
          <Like isClicked={likeClicked} likeClick={click}></Like>
          <Link href="/blog" className={styles.back}>
            記事一覧に戻る
          </Link>
        </Main>
        <Side addStyle={styles.rowGap}>
          <Author name={author} postedDate={postedDate}></Author>
          <FancyBlogLinks data={related} headline="関連記事"></FancyBlogLinks>
          <FancyBlogLinks data={latest} headline="最新記事"></FancyBlogLinks>
          <Twitter></Twitter>
        </Side>
      </Layout>
      {/* </div> */}
      <Footer></Footer>
    </>
  );
}

export async function getStaticProps({ params }: PathProp) {

  const { dir } = params;
  // mdファイルの中身を抽出
  const mdData = await getBlogMd(dir);
  // gray-matterでmdDataをyaml部分とそれ以外に分離
  const fmtData = formatMd(mdData);
  // fmtDataのコンテンツ部分をhtml化
  const content = await toHTMLString(fmtData.content);
  // yaml部分
  const data = fmtData.data as DataProp;

  // 処理対象となるblog抽出
  const targetBlog = await findByDir(dir);
  // targetBlogのキーワードから関連記事を抽出
  const _rels = await relatedBlogs(targetBlog);
  // 最新記事を3つ。自分自身は除外。
  const _news = await newBlogs(3, { discludeDir: dir });

  const related: LinkItem[] = _rels.map(blogInfoToLinkItem);
  const latest = _news.map(blogInfoToLinkItem);
  return {
    props: { content, data, related, latest },
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
