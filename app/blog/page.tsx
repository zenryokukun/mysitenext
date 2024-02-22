import Content from "./Content";
import { findBlogDocs } from "../../lib/db/func";
import { dateToString } from "../../lib/util";
import sortByDate from "../../lib/db/sort-bloginfo";
import keywordsSet from "./keywordsSet";
import styles from "../../styles/Blog.module.css";
import { ObjectId } from "mongodb";

/**Description ブログ記事の一覧Page
 * Date型項目を文字列化している内部用type。
 * `types.ts`の同項目とは異なる
 */
export interface BlogInfoOverrides {
  assetsDir: string;
  thumb: string;
  posted: string;
  title: string;
  summary: string;
  md: string;
  genre: string;
  keywords?: string[];
}

// MongoDBの_idがObject型のため、client componentに渡せない。
// deleteで_idを削除したいが、?がついたプロパティでないと出来ない。
// WithId<BLogInfo> -> BLogInfoOverridesに型変換の間にかませるための型。
interface TmpBlogInfo extends BlogInfoOverrides {
  _id?: ObjectId;
}


async function getProps() {
  const unsortedData = await findBlogDocs(50);
  const data = sortByDate(unsortedData);
  const docs: BlogInfoOverrides[] = [];
  data.map(blog => {
    // posted,firstPostedDateの２つの日付項目を片方に寄せて、文字列にする。
    const _posted = blog.firstPostedDate || blog.posted;
    const posted = _posted === undefined ? "-" : dateToString(_posted);
    // postedをBlogInfoにマージ。TmpBlogInfo型にして、_idプロパティを削除する。
    const tmpBlogInfo: TmpBlogInfo = { ...blog, posted };
    delete tmpBlogInfo._id;
    // BLogInfoOverrides型として登録
    docs.push(tmpBlogInfo)
  })

  return docs;
}

async function getKeyWordsProp(docs: BlogInfoOverrides[]) {
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
