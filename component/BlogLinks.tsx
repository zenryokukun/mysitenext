/**
 * サイドバー等に「関連記事」や「最新記事」のような記事一覧を表示するコンポーネント
 */

import Link from "next/link";
import { getStyle } from "./common";
import type { LinkItem } from "../types";

import styles from "./BlogLink.module.css";

interface BLProp {
  data: LinkItem[]; // 記事情報
  headline: string; // 見出し。「最新記事」とか。
  showSummary?: boolean // サマリの表示をするか
  addStyle?: string, // styleを追加する場合
  replaceStyle?: string, // styleを上書きする場合
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
export function FancyBlogLinks({ data, headline, showSummary, addStyle, replaceStyle }: BLProp) {
  const wrapperStyle = () => {
    if (!showSummary) {
      return styles.fancyItemWrapper
    }
    return styles.fancyItemWrapper + " " + styles.withSummary;
  }

  const linkStyle = getStyle(wrapperStyle(), addStyle, replaceStyle);

  return (
    <section>
      <div className={styles.head}>{headline}</div>
      {data.map((rel, i) => {
        const thumb = (rel.thumb && rel.thumb.length > 0) ? rel.thumb : "/zen_logo.png";
        return (
          <a href={rel.url} className={linkStyle} key={i}>
            <div className={styles.fancyImageWrapper}>
              <img className={styles.fancyImage} src={thumb} alt="thumbnail" />
            </div>
            {
              showSummary
                ?
                <div className={styles.fancyText}>
                  <span className={styles.summaryTitle}>{rel.title}</span>
                  <span className={styles.summary} >{rel.summary}</span>
                </div>
                :
                <div className={styles.fancyText}>
                  <span>{rel.title}</span>
                </div>
            }
            <div className={styles.when}>{rel.posted}</div>
          </a>
        );
      })}
    </section>
  );
}