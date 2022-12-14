import MyHead from "../component/MyHead";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import { MODE } from "../component/constants";
import styles from "../styles/Update.module.css";
import { getUpdateMd, formatMd, toHTMLString } from "../lib/util";

/**Description Update Page */

interface PageProp {
  content: string,
  /**
   * 当面、data:{title:string,author:string}のを想定。
   */
  data: {
    [key: string]: string,
  }
}

// _app.tsxで {..props}とページ呼び出してるので、{props}でなく中身を受け取る形（{content}）にする
export default function Updates({ content, data }: PageProp) {
  return (
    <>
      <MyHead
        title={data.title}
      ></MyHead>
      <Menu iniMode={MODE.UPDATES}></Menu>
      <main className={styles.mainContainer}>
        <article
          className={styles.articleContainer}
          dangerouslySetInnerHTML={{ __html: content }}
        ></article>
      </main>
      <Footer></Footer>
    </>
  );
}

export async function getStaticProps() {
  const mdData = await getUpdateMd();
  const fmtData = formatMd(mdData);
  const content = await toHTMLString(fmtData.content);
  const { data } = fmtData;
  return {
    props: { content, data }
  };
}