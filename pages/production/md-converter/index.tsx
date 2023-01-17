/**
 * 
 * md -> htmlに変換するサービス
 * PCならドラッグ&ドロップ、モバイルならクリック（非表示<input type=file>に設定）でアップロード。
 * PCとモバイルで選択したファイルを取得する方法が異なる点に留意。
 * PC -> dragイベントのdataTransferオブジェクトからfileオブジェクトを取得
 * モバイル -> inputのfilesオブジェクトから取得
 */

import MyHead from "../../../component/MyHead";
import Menu from "../../../component/Menu";
import Footer from "../../../component/Footer";
import Loader from "../../../component/Loader";
import { MODE } from "../../../component/constants";
import { useEffect, useRef, useState } from "react";

import DOMPurify from "dompurify";
import genDocString from "../../../lib/mdconv/download";

import type React from "react";
import styles from "../../../styles/Md-converter.module.css";

// meta description用文字列
const DESCR = `MDを見やく、簡易なCSS込みでHTMLに変換するサービスです。GitHub-Flavored-MarkDownに対応しています。`

export default function Page() {
  // formのnameにつける。
  const fileFormName = "upload";
  // mobile用。input fileのrefを格納。
  const fileInput = useRef<HTMLInputElement>(null);
  // ドラッグした時に色を変えるために必要。
  const [isEnter, setEnter] = useState(false);
  // html変換中に表示するloaderの制御に使う。
  const [isLoading, setIsLoading] = useState(false);
  // 変換html文字列。
  const [resString, setResString] = useState("");

  // click meをクリックした時の処理。
  const manualSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const ref = fileInput.current;
    if (!ref) return;
    ref.click();
  }

  // manualSelectでファイル選択した後の処理。アップロード。
  const manualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const ref = fileInput.current;
    if (!ref || !ref.files || ref.files.length === 0) return;
    // fileは１つしか選択できないので。
    upload(ref.files[0]);
  }

  // onDrop event handler
  const drop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // dropしたら。「ドラッグしてない状態」に戻す。cssを切り替えるために必要。
    setEnter(false);

    // dataTranser.itemsやdataTransfer.filesについては以下のリンクを参照。ブラウザによってサポートが異なる模様。
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
    if (e.dataTransfer.items) {
      // dataTransfer.itemsで処理される場合

      // itemsをArrayに変換
      const items = Array.from(e.dataTransfer.items);
      if (items.length > 1) {
        // 複数選択は想定していないのでエラー。
        alert("ファイルは１つだけにしてください。");
        return;
      }
      items.forEach(item => {
        if (item.kind === "file") {
          // Fileオブジェクトとして取得
          const file = item.getAsFile();
          if (file === null) return; // for文でなくforEachなのでcontinueではないよ。
          upload(file);
        }
      });
    } else if (e.dataTransfer.files) {
      // dataTransfer.filesで処理される場合

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 1) {
        alert("ファイルは１つだけにしてください。");
        return;
      }
      files.forEach(file => {
        upload(file);
      })
    }
  };

  // onDragOver event handler
  const dragover = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // setEnter(true);
  };

  // onDragEnter event handler
  const dragenter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setEnter(true);
  };
  // onDragLeave event handler
  const dragleave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setEnter(false);
  };

  // html表示画面で戻るボタンを押した時の処理
  const back = (e: React.MouseEvent<HTMLDivElement>) => {
    setResString("");
  };

  // custom single-file upload
  const upload = (file: File) => {
    if (!file.name.endsWith(".md") && !file.name.endsWith(".MD")) {
      // 拡張子が.md出ない場合はエラーにする。
      alert(`拡張子が".md"、".MD"のファイルが対象です。選択されたファイル名： ${file.name}`);
      return;
    }

    // loaderをオン。
    setIsLoading(true);

    // form形式でデータを作成し、POST.
    const formData = new FormData();
    formData.append(fileFormName, file, file.name);
    fetch("/api/md-convert", {
      method: "POST",
      body: formData,
    })
      .then(res => res.text())
      .then(htmlString => {
        setResString(htmlString);
        window.scrollTo({ top: 0 }) // scrollをトップに戻す。
      })
      .catch(e => alert(e))
      .finally(() => {
        // 正常時、エラー時でもloaderをオフにする
        setIsLoading(false);
      })
  };

  return (
    <>
      <MyHead title="MD-CONVERTER" metaDescription={DESCR}></MyHead>
      <Menu iniMode={MODE.PRODUCTION}></Menu>
      {isLoading && <Loader text="ナウ、ローディン..."></Loader>}
      <main className={styles.container}
        onDrop={(e) => e.preventDefault()}
        onDragOver={e => e.preventDefault()}>
        {resString.length === 0 ?
          <div className={styles.mainWrapper}>
            <h1 className={styles.mainHeader}>MDファイルをHTMLに変換するサービスです</h1>
            <p className={styles.mainAppeal}>オフラインでも閲覧できるように、ダウンロード機能もつけました。GitHub-Flavored-MarkDownにも対応しています。</p>
            {/* <form
              onSubmit={submit}
              className={styles.mobile}
              action="" method="post"
              encType="multipart/form-data">
              <fieldset>
                <legend>mdファイルを選択してください。</legend>
                <input type="submit" value="htmlに変換" />
                </fieldset>
              </form> */}
            <input
              className={styles.hidden} type="file" onChange={manualUpload} name={fileFormName} ref={fileInput} />
            <div
              className={
                isEnter
                  ? `${styles.dropTarget} ${styles.enter}`
                  : styles.dropTarget
              }
              onDrop={drop}
              onDragOver={dragover}
              onDragEnter={dragenter}
              onDragLeave={dragleave}
            >
              {/* {isEnter && <div className={styles.coverup} onDrop={drop} onDragOver={dragover} onDragEnter={dragenter} onDragLeave={dragleave}></div>} */}
              <h5>使い方</h5>
              <ol className={styles.listContainer}>
                <li>.mdファイルをドラッグ＆ドロップ、もしくはClick me to upload!をクリック</li>
                <li>HTMLに変換され、ブラウザに表示されます!</li>
                <li>downloadリンクをクリックすると、HTMLをダウンロードできます</li>
                <li>HTMLファイルをMDファイルと同じ場所に置けば、画像も正しく表示されます</li>
              </ol>
              <h5>注意点</h5>
              <ol className={styles.listContainer}>
                <li>HTMLタグが埋め込まれている場合、正しく描写しない場合があります</li>
                <li>ローカルの画像はオンラインでは表示されません。使い方3,4をご参照ください</li>
              </ol>
              <div className={styles.hideOnMobile}>Drag-and-drop your MD file here! Or,</div>
              <button className={styles.manual} onClick={manualSelect}>Click me to upload!</button>

            </div>
            <aside className={styles.otherInfos}>
              <section className={styles.section}>
                <h4>お問い合わせ</h4>
                <p>不具合、要望などは<a href="mailto:zenryokukun@gmail.com">メール</a>でお問い合わせください。</p>
              </section>
              <section className={styles.section}>
                <h4>アップロードファイルについて</h4>
                <p>MDファイルに悪意のあるスクリプトを埋め込む攻撃も存在します。本サービスでも対策はしていますが、ファイルの作成元が信頼できることを確認の上、ご利用ください。</p>
                <p>ファイルおよびそのコンテンツはHTML変換処理にのみ利用します。データは変換処理後に削除しており、他のサービスでの利用は行わないことを保証します。</p>
              </section>
              <section className={styles.section}>
                <h4>動機</h4>
                <p>
                  MDファイルは、主にソフトウェア関連の説明資料に用いられ、エンジニアが見る前提で作られている印象がありました。
                  しかし、HTML等、他のファイルフォーマットへの変換が容易で、ウェブページのコンテンツとしても使われていることを知り、その利便性の高さに驚きました。
                </p>
                <p>
                  これからも、mdファイルの表現力、他フォーマットとの互換性が高まるにつれて、他の使われ方も増えてくると思います。
                  例えば、簡単なメモをWordの代わりにMDで作成してくるケースも考えられるのではないでしょうか。
                </p>
                <p>
                  とは言え、MDファイルをそのままテキストエディタで開いても、見やすくはありません。他のフォーマットに変換して閲覧するのが前提になるでしょう。
                </p>
                <p>
                  MD⇔HTMLの変換サービスはたくさんありますが、簡易的でもスタイルシートを調整して変換するものは見つけられませんでした。
                  非エンジニアの方でも見やすいフォーマットに、簡易的でもサクサクっと変換してくれるサービスがあれば便利かな、と思い作成しました。
                </p>
              </section>
            </aside>
          </div> :
          <Article html={resString} back={back} />
        }
      </main>
      <Footer></Footer>
    </>
  );
}

/**
 * <Article />
 * MD返還後のHTMLを表示するComponent
 */
interface ArticleProp {
  html: string,
  back: (e: React.MouseEvent<HTMLDivElement>) => void,
}

// type ThemeType = "dark" | "light" | "fancy";

/********************************************
 *  TODO
 *  <style jsx></style>を使ったテーマの切替
 * htmlをinnerHTMLで入れているせいか、切替が実装出来ず。
 * いったん無しでリリース
 ********************************************/
function Article({ html, back }: ArticleProp) {
  // sanitize dirty html
  const cleanHtml = DOMPurify.sanitize(html);
  // blobのURLをa.hrefに差し込むため、aタグのrefを保存する
  const aRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    /**
     * 初回ロード後に１回のみ実行。
     * ダウンロード用ボタンをクリックした時にダウンロードできるように、
     * ファイルから変換したhtmlからダウンロード用html文字列を生成し、リンク化する。
     * クリーンアップとして、unmount時にurlは削除する。
     */

    // ダウンロード用<input type="file">のリファレンス取得
    const ref = aRef.current;
    if (!ref) return;
    // 変換したhtmlからダウンロード用html文字列を取得
    const docstring = genDocString(cleanHtml);
    // blobに変換
    const blob = new Blob([docstring], { type: "text/html" })
    // blobをリンク化
    const url = URL.createObjectURL(blob);
    // aタグのhrefにリンクを設定
    ref.href = url;
    // unmount時に実行。リンク削除（メモリ解放）
    return (() => URL.revokeObjectURL(ref.href));
  }, []);

  return (
    <>
      {/* <div className={styles.theme}>
        <div className={getStyle("light")} onClick={() => click("light")}>light</div>
        <div className={getStyle("dark")} onClick={() => click("dark")}>dark</div>
        <div className={getStyle("fancy")} onClick={() => click("fancy")}>fancy</div>
      </div > */}
      <div className={styles.util}>
        <div className={styles.back} onClick={back}>アップロード画面に戻る</div>
        <div>
          <a ref={aRef} download="your-html.html">ダウンロード</a>
        </div>
      </div>
      <article className={styles.articleWrapper} dangerouslySetInnerHTML={{ __html: cleanHtml }}>
      </article>
    </>
  );
}