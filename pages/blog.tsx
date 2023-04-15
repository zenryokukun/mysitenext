import Image from "next/image";
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

/**Description ブログ記事の一覧Page */
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

  // useEffect(() => {
  //   Router.events.on("routeChangeStart", () => setLoading(true));
  //   Router.events.on("routeChangeComplete", () => setLoading(false));
  //   Router.events.on("routeChangeError", () => setLoading(false));
  //   // clean up
  //   return () => {
  //     Router.events.off("routeChangeStart", () => setLoading(true));
  //     Router.events.off("routeChangeComplete", () => setLoading(false));
  //     Router.events.off("routeChangeError", () => setLoading(false));
  //   }
  // }, [Router.events])

  useEffect(() => {
    return () => {
      Router.events.off("routeChangeStart", () => setLoading(true));
      Router.events.off("routeChangeComplete", () => setLoading(false));
      Router.events.off("routeChangeError", () => setLoading(false));
    };
  }), [Router.events];

  const readClick = () => {
    Router.events.on("routeChangeStart", () => setLoading(true));
    Router.events.on("routeChangeComplete", () => setLoading(false));
    Router.events.on("routeChangeError", () => setLoading(false));
  };

  return (
    <>
      <MyHead
        metaDescription="ブログ記事の一覧です。主に、プログラム関係の記事や、一人旅に関する記事を公開しています。"
        useBreadCrumb={true}
        title="記事一覧"
      />
      {isLoading && <Loader text="ナウ、ローディン..."></Loader>}
      <Menu iniMode={MODE.BLOG}></Menu>
      <main className={styles.container}>
        <div className={styles.content}>
          {blogDocs.map((blog, i) => blogLink(blog, i, readClick))}
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}

function blogLink(props: BlogInfo, i: number, fn: () => void) {
  const { assetsDir, thumb, posted, title, summary } = props;
  const thumbClass = thumb.length > 0 ? styles.thumb : styles.logo
  //EX:/public/posts/201102_1 
  const thumbPath = thumb.length > 0
    ? "/posts/" + assetsDir + "/" + thumb
    : "/zen_logo.png";
  const route = `/post/${assetsDir}`;
  return (
    <div key={i} className={styles.wrapper}>
      <div className={styles.imgWrapper}>
        <Image
          src={thumbPath}
          alt="thumbnail"
          fill
          sizes="(max-width:900px):95vw,(max-width:1100px) 25vw,16vw"
          className={thumbClass} />
      </div>
      <h3 className={styles.when}>{posted}</h3>
      <div className={styles.description}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.summary}>{summary}</p>
      </div>
      <Link href={route} className={styles.noDecoration} onClick={() => fn()}>
        <button className={styles.read}>
          Read
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
  const data = await findBlogDocs(50);
  const blogDocs = JSON.parse(JSON.stringify(data));
  return {
    props: {
      blogDocs,
    }
  }
}