import Link from "next/link";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import MyHead from "../component/MyHead";
import { MODE } from "../component/constants";
import styles from "../styles/Blog.module.css";
// import { findBlogDocs, init } from "../lib/db/dbclient";
import { findBlogDocs } from "../lib/db/func"

interface BlogInfo {
  _id: string,
  genre: string,
  assetsDir: string,
  title: string,
  summary: string,
  thumb: string,
  md: string,
  posted: string,
}

export default function BlogList({ blogDocs }: { blogDocs: BlogInfo[] }) {

  return (
    <>
      <MyHead title="記事一覧"></MyHead>
      <Menu iniMode={MODE.BLOG}></Menu>
      <main className={styles.container}>
        <div className={styles.content}>
          {blogDocs.map((blog, i) => blogLink(blog, i))}
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}

function blogLink(props: BlogInfo, i: number) {
  const { assetsDir, thumb, posted, title, summary } = props;
  const thumbClass = thumb.length > 0 ? styles.thumb : styles.logo
  //EX:/public/posts/201102_1 
  const thumbPath = thumb.length > 0
    ? "/posts/" + assetsDir + "/" + thumb
    : "zen_logo.png";
  const route = `/post/${assetsDir}`;
  return (
    <div key={i} className={styles.wrapper}>
      <div className={styles.imgWrapper}>
        <img className={thumbClass} src={thumbPath} alt="thumbnail" />
      </div>
      <h3 className={styles.when}>{posted}</h3>
      <div className={styles.description}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.summary}>{summary}</p>
      </div>
      <Link href={route}>
        <button className={styles.read}>
          <a className={styles.noDecoration}>Read</a>
        </button>
      </Link>
    </div>
  );
}

export async function getStaticProps() {
  // findBlogDocs return type
  //  {  
  //     id: object,
  //     genre: string,
  //     assetsDir: string,
  //     title: string,
  //     summary: string,
  //     thumb: string,
  //     md: string,
  //  }
  const data = await findBlogDocs(20);
  const blogDocs = JSON.parse(JSON.stringify(data));
  return {
    props: {
      blogDocs,
    }
  }
}