/**
 * サイドバー等に「関連記事」や「最新記事」のような記事一覧を表示するコンポーネント
 */

import Link from "next/link";
import type { BlogLinkItem } from "../types";

import styles from "./BlogLink.module.css";

interface BLProp {
  data: BlogLinkItem[]; // 記事情報
  headline: string; // 見出し。「最新記事」とか。
}

/**
 * Simple Blog Links
 */
export default function BlogLinks({ data, headline }: BLProp) {
  return (
    <section className={styles.container}>
      <div className={styles.head}>{headline}</div>
      <ul className={styles.itemWrapper}>
        {
          data.map((rel, i) => {
            return (
              <li className={styles.item} key={i}>
                <Link href={rel.url}>{rel.title}</Link>
              </li>
            );
          })
        }
      </ul>
    </section>
  );
}

/**
 * Fancy blog links
 */
export function FancyBlogLinks({ data, headline }: BLProp) {
  return (
    <section>
      <div className={styles.head}>{headline}</div>
      {data.map((rel, i) => {
        const thumb = (rel.thumb && rel.thumb.length > 0) ? rel.thumb : "/zen_logo.png";
        return (
          <a href={rel.url} className={styles.fancyItemWrapper} key={i}>
            <div className={styles.fancyImageWrapper}>
              <img className={styles.fancyImage} src={thumb} alt="thumbnail" />
            </div>
            <span className={styles.fancyText}>{rel.title}</span>
            <div className={styles.when}>{rel.posted}</div>
          </a>
        );
      })}
    </section>
  );
}