import Image from "next/image";
import Link from "next/link";
import { findBlogDocs } from "../../lib/db/func";
import { dateToString } from "../../lib/util";
import sortByDate from "../../lib/db/sort-bloginfo";
import styles from "../../styles/Blog.module.css";

/**Description ブログ記事の一覧Page
 * Date型項目を文字列化している内部用type。
 * `types.ts`の同項目とは異なる
 */
interface BlogInfoOverrides {
  assetsDir: string;
  thumb: string;
  posted: string;
  title: string;
  summary: string;
}


async function getProps() {
  const unsortedData = await findBlogDocs(50);
  const data = sortByDate(unsortedData);
  const docs: BlogInfoOverrides[] = [];
  data.map(blog => {
    // posted,firstPostedDateの２つの日付項目を片方に寄せて、文字列にする。
    const _posted = blog.firstPostedDate || blog.posted;
    const posted = _posted === undefined ? "-" : dateToString(_posted);
    docs.push({ ...blog, posted })
  })

  return docs;
}

export default async function Page() {

  const blogDocs = await getProps()

  return (
    <>
      <main className={styles.container}>
        <div className={styles.content}>
          {blogDocs.map((blog, i) => <BlogLink key={i} blog={blog} i={i} />)}
        </div>
      </main>
    </>
  )
}


interface BlogLinkProp {
  blog: BlogInfoOverrides;
  i: number;
}
function BlogLink({ blog, i }: BlogLinkProp) {
  const { assetsDir, thumb, posted, title, summary } = blog;
  const thumbClass = thumb.length > 0 ? styles.thumb : styles.logo
  //EX:/public/posts/201102_1 
  const thumbPath = thumb.length > 0
    ? "/posts/" + assetsDir + "/" + thumb
    : "/zen_logo.png";
  const route = `/post/${assetsDir}`;
  return (
    <div className={styles.wrapper}>
      <div className={styles.imgWrapper}>
        <Image
          src={thumbPath}
          alt="thumbnail"
          fill
          sizes="(max-width:900px):95vw,(max-width:1100px) 25vw,16vw"
          className={thumbClass}
          priority={i < 10 ? true : false} />
      </div>
      <h3 className={styles.when}>{posted}</h3>
      <div className={styles.description}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.summary}>{summary}</p>
      </div>
      <Link href={route} className={styles.noDecoration}>
        <button className={styles.read}>
          Read
        </button>
      </Link>
    </div>
  )
}