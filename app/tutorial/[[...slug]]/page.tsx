/**
 * Optional Catch-all Segmentsで実装予定
 * /tutorial,tutorial/python/basic,tutorial/html/block-and-inline　いずれも有効になる想定
 * 
 * 詳細はドキュメント：
 * https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#optional-catch-all-segments
 */

import path from "path";
import { readFile } from "fs/promises";
import { notFound } from "next/navigation";
import Menu from "./Menu";
import Request from "../../../component/Request";
import Footer from "../../../component/Footer";
import { Message } from "../../../component/Icons";
import { formatMd } from "../../../lib/util";
import parseMd from "../../../lib/parse-md-linenumbers";
import { getTutorials, findTutorialBySlugs } from "../../../lib/db/sqlite-query-tutorial";
import getAccordionProps from "./accordion-props";
import styles from "./Tutorial.module.css";
import "prismjs/themes/prism-tomorrow.css"; // コードのハイライト用
import "../../post/[dir]/prism-overrides.css"; // コードのハイライトのカスタム部分
import "../../../styles/line-and-highlight.css"; // コードの行数を表示する用
import "./md.css";
import type { TutorialRec } from "../../../lib/db/sqlite-types";
import type { Metadata } from "next";

/**
 * metadataを動的に生成するNext.js関数
 * パラメタはdunamic routesのパス部分 
 * @param {params:{slug:string[]}}
 * @returns 
 */
export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  // ルートはparams:{}のように空になる。後にjoin(",")するため、slugが無い場合に空文字（""）になるように[]をセット。
  const slug = params.slug || [];
  let rec: TutorialRec | undefined;
  try {
    rec = await findTutorialBySlugs(slug.join(","))
  } catch (err) {
    return {};
  }
  if (!rec) return {};

  // openGraphやtwitterCardの画像
  const domain = process.env.NODE_ENV !== "production" ? "http://localhost:3000/" : "https://www.zenryoku-kun.com/"
  const imagePath = domain + "opengraph-zen-logo.jpg";

  // metadata情報を生成して返す。
  return {
    title: rec.TITLE,
    description: rec.DESCRIPTION,
    openGraph: {
      type: "website",
      title: rec.TITLE,
      url: domain + "tutorial/" + rec.SLUGS.replaceAll(",", "/"),
      images: [{
        url: imagePath,
        width: 1200,
        height: 630,
        alt: "my-logo",
      }],
    },
    twitter: {
      site: "@zenryoku_kun0",
      title: rec.TITLE,
      description: rec.DESCRIPTION,
    },
  };
}

/**
 * dynamicRoutesを生成するNext.js関数
 */
export async function generateStaticParams() {
  const recs = await getTutorials();
  const params = recs.map(rec => {
    return { slug: rec.SLUGS.split(",") };
  });
  return params;
}

/**
 * slugに対応したページのmdを取得し、html文字列に変換して返す
 * @param slug 生成するページのパス
 * @returns mdからパースされたhtml文字列
 */
async function getProps(slug: string[]) {
  let rec: TutorialRec | undefined;
  // dynamicRoutesから該当するDBのレコードを取得。取得できない場合はNotFoundページ
  try {
    rec = await findTutorialBySlugs(slug.join(","))
  } catch (err) {
    return notFound();
  }

  // レコードが取得できなかった場合はNotFoundページ
  if (rec === undefined || rec === null) return notFound();


  /**
   * public/turotiralがベースの格納先。DB情報をもとにファイルを特定し、
   * mdをパースしてコンテンツ部分を返す。
   */
  const base = path.join(path.resolve(), "public/tutorial");
  const mdPath = path.join(base, rec.SYSTEM_PATH, rec.FILENAME);
  // readFileがエラーになる場合（mdファイルが存在しない等）、NotFoundページを返す。
  let fileData: string
  try {
    fileData = await readFile(mdPath, { encoding: "utf-8" });
  } catch (err) {
    return notFound();
  }
  const fmtData = formatMd(fileData);
  const content = await parseMd(fmtData.content);
  return content;
}

interface PageProp {
  params: {
    slug: string[];
  }
}
export default async function Page({ params }: PageProp) {
  // catch-optional-routeの場合、rootのparamsは{slug:[]}ではなく、{}となる。
  // そのため、params.slugが無い場合は空配列を渡す
  const content = await getProps(params.slug || []);
  const accordionProps = await getAccordionProps();
  return (
    <>
      <div className={styles.container}>
        {/* Left Side Bar */}
        <Menu data={accordionProps} />
        {/* 真ん中と右のコンテナ */}
        <div className={styles.mediaContainer}>
          {/* 真ん中 */}
          <article
            className={styles.centerContainer}
            dangerouslySetInnerHTML={{ __html: content }}
          />
          {/* right side bar */}
          <section className={styles.rightContainer}>
            <div className={styles.requestContainer}>
              <h2 className={styles.labelMedium}>
                <Message className={styles.msgIcon} />
                Contact Me!
              </h2>
              <Request
                placeholder="要望、誤り等があれば教えてください。返信をご希望の場合は、boardに書き込むか、フッターのTwitter宛てにご連絡ください。"
                rows={10} maxLength={300}
              />
            </div>
          </section>
        </div>
      </div>
      <Footer></Footer>
    </>
  )
}