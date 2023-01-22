import { useRouter } from "next/router";
import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import { MODE } from "../../component/constants";
import { breadCrumbFromPath } from "../../lib/bread";

import styles from "../../styles/Policy.module.css";

export default function Policy() {
  const router = useRouter(); // breadCrumbの動的生成に必要
  return (
    <>
      <MyHead
        metaDescription="プライバシーポリシーや免責事項、サイト利用の動作環境についての説明です。"
        title="Site Policy"
        breadCrumbsJSON_ld={breadCrumbFromPath(router)}
      />
      <Menu iniMode={MODE.ABOUT}></Menu>
      <div className={styles.container}>
        <main className={styles.wrapper}>
          <section className={styles.underline}>
            <h1 className={styles.header}><i className="fa-solid fa-building-shield"></i>サイトポリシー</h1>
            <p>
              このWebサイトは個人（私、全力君）が運営しています。当サイトを利用される場合は、以下の各事項につきご了承をお願いいたします。
            </p>
          </section>
          <section className={styles.postit}>
            <h2><i className="fa-solid fa-key"></i>プライバシーポリシー</h2>
            <p>
              当サイトでは「Googleアナリティクス」を使ってアクセス解析をしています。同ツールでは、Cookieを使ってデータの収集を行います。
              サイト内での操作や滞在時間、デバイスのOSやブラウザの種類、アクセス元（国）等の情報を収集しています。
              サイト運営者は、「Googleアナリティクス」による解析結果としてデータにアクセスが可能です。
              解析結果は、当サイトのクオリティー、アクセス数向上のために活用します。それ以外の用途では一切利用しません。
            </p>
            <p>
              取集するデータや、収集する方法の詳細については<a href="https://policies.google.com/technologies/cookies?hl=ja#how-google-uses-cookies">Google社のポリシーと規約</a>をご確認ください。
            </p>
          </section>
          <section className={styles.postit}>
            <h2><i className="fa-solid fa-copyright"></i>著作権</h2>
            <p>当サイト上のコンテンツは、特段の記載が限り、サイト運営者が所有・管理しているものです。著作権法による認められる場合を除き、サイト運営者に無断で複製・改変することは禁止されています。</p>
          </section>
          <section className={styles.postit}>
            <h2><i className="fa-solid fa-triangle-exclamation"></i>免責事項</h2>
            <ul className={styles.listWrapper}>
              <li>当サイトの利用は訪問者の責任において行われるものとします。</li>
              <li>当サイトの利用により生じた経済的不利益、精神的不利益について、サイト運営者は一切の責任を負いません。</li>
              <li>当サイト、およびそのコンテンツは予告なく削除される可能性があります。</li>
              <li>サイト運営者は、当サイトのコンテンツの内容の正確性、各種サービスの完全性を保証しません。</li>
            </ul>
          </section>
          <section className={styles.postit}>
            <h2><i className="fa-brands fa-internet-explorer"></i>動作環境</h2>
            <p>当サイトはChrome 109.0.5414.75(64bit)以上のバージョンでテストしています。</p>
            <ul className={styles.listWrapper}>
              <li>ECMAScript5(ES5)互換にしています。2023年1月時点で、Chrome、Edge、Safari、Opera、FireFox等の
                主要なモダン・ブラウザでサポートされています。IEの場合、バージョンは9以上である必要があります。
              </li>
              <li>一部ページはES5互換対応が未実施のため、古いブラウザのバージョンだと閲覧できない可能性があります。</li>
              <li>media queryを使ったレスポンシブ・デザインを採用しています。PC、タブレット、モバイル等、様々なサイズのデバイスで
                閲覧が可能です。主に、10.1inch以上のディスプレイを搭載したPC・タブレット、6inch前後のディスプレイのスマートフォンを想定してチューニングしています。
              </li>
              <ul className={styles.listWrapper}>
                <li>一部ページはPCのみを想定した作りになっています。</li>
                <li>
                  スマホを横向き・タブレットを縦向きにした場合（画面幅601px～1024pxの場合）に表示が多少崩れる場合があります。
                </li>
              </ul>
            </ul>
          </section>
        </main>
      </div>
      <Footer></Footer>
    </>
  );
}