import Content from "./Content";
import { findBlogDocs } from "../../lib/db/sqlite-query-assets";
import sortByDate from "../../lib/db/sort-bloginfo";
import keywordsSet from "./keywordsSet";
import styles from "../../styles/Blog.module.css";

/**Description ブログ記事の一覧Page
 * AssetsRec型から変換する。
 * BlogCard,Contentで既に使われていたので、AssetsRec型に書き換えず、
 * AssetsRec -> BlogProp型に変換する
 */
export interface BlogProp {
  assetsDir: string;
  thumb: string;
  posted: string;
  title: string;
  summary: string;
  md: string;
  genre: string;
  keywords?: string[];
}


/**
 * blogの一覧を取得し、BlogProp型に変換して返す。
 * @returns 
 */
async function getProps() {
  const unsortedData = await findBlogDocs(50);
  const data = sortByDate(unsortedData);
  const docs: BlogProp[] = [];
  data.map(blog => {
    // posted,firstPostedDateの２つの日付項目を片方に寄せて、文字列にする。
    const _posted = blog.FIRST_POSTED_DATE || blog.POSTED;
    const posted = _posted === undefined ? "-" : _posted;
    // KEYWORDSをstring -> string[]に変換
    const keywords = blog.KEYWORDS.split(",");
    // AssetsRec -> BlogPropに変換
    const prop: BlogProp = {
      assetsDir: blog.DIR,
      thumb: blog.THUMB,
      posted: posted,
      title: blog.TITLE,
      summary: blog.SUMMARY,
      md: blog.MD,
      genre: blog.GENRE,
      keywords: keywords,
    };

    docs.push(prop);

  })

  return docs;
}

/**
 * keywordの一覧から重複を排除して返す
 * @param docs 
 * @returns 
 */
async function getKeyWordsProp(docs: BlogProp[]) {
  return keywordsSet(docs);
}

export default async function Page() {

  const blogDocs = await getProps();
  const keywords = await getKeyWordsProp(blogDocs);
  return (
    <>
      <main className={styles.container}>
        <Content keywords={keywords} blogDocs={blogDocs} />
      </main>
    </>
  )
}
