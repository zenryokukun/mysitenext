import getProps from "./getProps";
import styles from "./Updates.module.css";
import "./nav.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "更新履歴と今後の予定",
  description: "サイトの主な更新履歴と今後の更新予定です。 サイトに関するお知らせも記載します。",
};

export default async function Page() {
  const content = await getProps();
  return (
    <>
      <main className={styles.mainContainer}>
        <article
          className={styles.articleContainer}
          dangerouslySetInnerHTML={{ __html: content }}
        ></article>
      </main>
    </>
  );
}