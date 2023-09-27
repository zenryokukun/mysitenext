import Link from "next/link";
import Layout, { Main, Side } from "../../../component/layouts/sidebar/Layout";
import Author from "../../../component/Author";
import Twitter from "../../../component/Twitter";
import Like from "../../component/Like";
import { FancyBlogLinks } from "../../../component/BlogLinks";
import Amazon from "../../../component/Amazon";
import { getMDBlogDirList } from "../../../lib/db/func"
import { getBlogMd, formatMd } from "../../../lib/util";
import parseMd from "../../../lib/parse-md";
import { findByDir, newBlogs, relatedBlogs, popularBlogs } from "../../../lib/db/extract";
import { blogInfoToLinkItem } from "../../../lib/typecast";
import type { HeadProp, LinkItem } from "../../../types";
import styles from "./Post-app.module.css";
/* md内で直指定されているclass */
import "./md.css";
/* syntax-higlight用CSS */
import "prismjs/themes/prism-tomorrow.css";
import "./prism-overrides.css";

/**
 * syntax-higlightする言語はここで読み込まず、parseMd内で読み込む。
 * ここで読み込んでも問題ないが、md-converterでも使うので外出し。
 */

// falseだとgennerateStaticParamsで生成されない場合404になる。
export const dynamicParams = false;

/**
 * gray-matterのfront-matter部分の型。
 * HeadPropにauthorとpostedDateを追加している。
 */
interface DataProp extends HeadProp {
  author?: string; // 作者名。サイドバーに表示
  postedDate?: string; // 投稿日YYYY/MM/DD。サイドバーに表示
}

export async function generateMetadata({ params }: { params: { dir: string } }) {
  const mdData = await getBlogMd(params.dir);
  // gray-matterでmdDataをyaml部分とそれ以外に分離
  const fmtData = formatMd(mdData);
  // yaml部分
  const data = fmtData.data as DataProp;
  return {
    title: data.title,
    description: data.metaDescription,
  }
}

// getStaticPathsのapp router版
export async function generateStaticParams() {
  const docs = await getMDBlogDirList();
  const params = docs.map(doc => {
    return { dir: doc["assetsDir"] }
  })
  return params;
}

// getStaticPropsのapp router版
async function getProps(dir: string) {
  // mdファイルの中身を抽出
  const mdData = await getBlogMd(dir);
  // gray-matterでmdDataをyaml部分とそれ以外に分離
  const fmtData = formatMd(mdData);
  // yaml部分
  const data = fmtData.data as DataProp;
  // fmtDataのコンテンツ部分をhtml化
  const content = await parseMd(fmtData.content);

  const targetBlog = await findByDir(dir);
  const _rels = await relatedBlogs(targetBlog);
  const _news = await newBlogs(3, { discludeDir: dir });
  const _popular = await popularBlogs(3);
  const related: LinkItem[] = _rels.map(blogInfoToLinkItem);
  const latest = _news.map(blogInfoToLinkItem);
  const popular = _popular.map(blogInfoToLinkItem);
  return { content, data, related, latest, popular };
}

interface PageProp {
  params: {
    dir: string;
  }
}

export default async function Page({ params }: PageProp) {
  const { content, data, related, latest, popular } = await getProps(params.dir);
  const author = data.author || "全力君";
  const postedDate = data.postedDate || "2022年";
  const { amazonLink } = data;
  return (
    <Layout>
      <Main>
        <Link href="/blog" className={styles.back}>記事一覧に戻る</Link>
        <article
          className={styles.articleContainer}
          dangerouslySetInnerHTML={{ __html: content }}
        ></article>
        <Like />
        <Link href="/blog" className={styles.back}>記事一覧に戻る</Link>
      </Main>
      <Side addStyle={styles.rowGap}>
        <Author name={author} postedDate={postedDate} />
        <FancyBlogLinks data={related} headline="関連記事" />
        <FancyBlogLinks data={latest} headline="最新記事" />
        <FancyBlogLinks data={popular} headline="人気記事" />
        <Amazon src={amazonLink} />
        {/*
          重たいのでコメントアウトする。。。いつか使いたい。 
          <Twitter /> 
        */}
      </Side>
    </Layout>
  )
}