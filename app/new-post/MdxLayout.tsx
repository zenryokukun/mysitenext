/**
 * Mdx用のレイアウト
 */

import Link from "next/link";
import Like from "../component/Like";
import Layout, { Main, Side } from "../../component/layouts/sidebar/Layout";
import Author from "../../component/Author";
import { FancyBlogLinks } from "../../component/BlogLinks";
import Navigation from "../../component/Navigation";
import Footer from "../../component/Footer";
import { MODE } from "../../component/constants";
import { findByDir, newBlogs, popularBlogs, relatedBlogs } from "../../lib/db/extract";
import { blogInfoToLinkItem } from "../../lib/typecast";

import type { FrontMatter, LinkItem } from "../../types";

// /app/post/[dir]と同じcssを使う。
// TODO: /stylesにcss移せば？
import styles from "../post/[dir]/Post-app.module.css";
import "../post/[dir]/md.css";
// Syntax Highlight用
import "prismjs/themes/prism-tomorrow.css";
import "../post/[dir]/prism-overrides.css";

interface LayoutP {
  // パス情報。キーワード等をdbから取得し、リンク生成する
  dir: string;
  // front-matter情報
  frontMatter: FrontMatter;
  // MDXのコンテント部分
  children: React.ReactNode;
}

// getStaticPropsのapp router版
async function getProps(dir: string) {
  /*TEST ONLY! Delete one line below when in production. */
  // dir = "twitter-api";
  const targetBlog = await findByDir(dir);
  const _rels = await relatedBlogs(targetBlog);
  const _news = await newBlogs(3, { discludeDir: dir });
  const _popular = await popularBlogs(3);
  const related: LinkItem[] = _rels.map(blogInfoToLinkItem);
  const latest = _news.map(blogInfoToLinkItem);
  const popular = _popular.map(blogInfoToLinkItem);
  return { related, latest, popular };
}

export default async function MdxLayout({ dir, frontMatter, children }: LayoutP) {
  const { author, postedDate, amazonLink } = frontMatter
  const { related, latest, popular } = await getProps(dir);
  return (
    <>
      <Navigation iniMode={MODE.BLOG} />
      <Layout>
        <Main addStyle={styles.overrideBC}>
          <Link className={styles.back} href="/blog">記事一覧に戻る</Link>
          <article className={styles.articleContainer}>{children}</article>
          <Like />
          <Link className={styles.back} href="/blog">記事一覧に戻る</Link>
        </Main>
        <Side addStyle={styles.rowGap}>
          <Author name={author} postedDate={postedDate} />
          <FancyBlogLinks data={related} headline="関連記事" />
          <FancyBlogLinks data={latest} headline="最新記事" />
          <FancyBlogLinks data={popular} headline="人気記事" />
        </Side>
      </Layout>
      <Footer />
    </>
  )
}