import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import MyHead from "../component/MyHead";
import Loader from "../component/Loader";
import { MODE } from "../component/constants";
import { findBlogDocs } from "../lib/db/func"
import styles from "../styles/Blog.module.css";

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

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", () => setLoading(true));
    Router.events.on("routeChangeComplete", () => setLoading(false));
    Router.events.on("routeChangeError", () => setLoading(false));
    // clean up
    return () => {
      Router.events.on("routeChangeStart", () => setLoading(true));
      Router.events.on("routeChangeComplete", () => setLoading(false));
      Router.events.on("routeChangeError", () => setLoading(false));
    }
  }, [Router.events])

  return (
    <>
      <MyHead title="記事一覧"></MyHead>
      {isLoading && <Loader text="ナウ、ローディン..."></Loader>}
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