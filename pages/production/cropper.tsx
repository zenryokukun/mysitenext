import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import Loader from "../../component/Loader";
import Layout from "../../component/layouts/sidebar/Layout";
import Main from "../../component/layouts/sidebar/MainPart"
import Side from "../../component/layouts/sidebar/SidePart"
import Author from "../../component/Author";
import Twitter from "../../component/Twitter";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { MODE } from "../../component/constants"
import { breadCrumbFromPath } from "../../lib/bread";

import styles from "../../styles/Cropper.module.css";

// meta description
const DESC = "スマホで撮影した縦長の画像を、任意の縦横比に切り取るサービスです。アスペクト比は9:16、2:3、3:4、1:1から選べ、リサイズにも対応しています。"
// api endpoint
const ENDPOINT = "/api/cropper/upload";
// resizeのラジオボタンのvalueのenum
type Resize = "default" | "custom";


export default function Page() {

  // file inputを制御するために使う
  const fileInput = useRef<HTMLInputElement>(null);

  // downloadのurlをaタグ（非表示）に設定するために使う
  const anchor = useRef<HTMLAnchorElement>(null);

  // アスペクト比のラジオボタン制御用
  const [ratio, setRatio] = useState<string>("0.5625");

  // リサイズのラジオボタン制御用
  const [resize, setResize] = useState<Resize>("default");

  // リサイズするときの幅
  const [customWidth, setCustomWidth] = useState<string>("");

  // アップロード中のLoader制御用
  const [isLoading, setLoading] = useState<boolean>(false);

  // breadcrumb生成に必要
  const router = useRouter();

  // アスペクト比のラジオボタン切り替え時、ratioを更新[controlled Component]
  const changeRatio = (e: React.ChangeEvent<HTMLInputElement>) => setRatio(e.target.value);

  // リサイズのラジオボタン切替時、resizeを更新[controlled Component]
  const changeResize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResize(e.target.value as Resize);
    if (e.target.value === "default") {
      // default選択時は、customに入力されていた値をクリアする。
      setCustomWidth("");
    }
  }
  // customの幅を変えた時、customWidthを更新[controlled Component]
  const changeCustomWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomWidth(e.target.value);
    setResize("custom");
  }
  // customWidthにフォーカスした時、ラジオボタンもcustomに切り替える
  const focus = (e: React.ChangeEvent<HTMLInputElement>) => setResize("custom")

  // カスタムsubmit
  const submit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (fileInput.current === null) return;
    const files = fileInput.current.files;
    if (files === null || files.length === 0) {
      alert("画像を選択してください。")
      return;
    };

    // formdataにformのinputをappendしていく。第一引数はinput要素のname。
    const formData = new FormData();

    // fileは複数選択可能。1つの場合も配列に入ってるのでこれでOK
    Array.from(files).map(file => formData.append("pics", file, file.name));

    // 配列以外のデータをappend.
    formData.append("ratio", ratio);
    formData.append("resize", resize);
    formData.append("width", customWidth);

    // fetch直前にLoaderをONにする。
    setLoading(true);

    // サーバにpost、サーバからはzipファイルが帰ってくるのでblobとして扱う。
    fetch(ENDPOINT, {
      method: "POST",
      body: formData,
    })
      .then(res => {
        if (!res.ok) throw res;
        return res.blob();
      })
      .then(blob => download(blob))
      .catch(res => {
        res.text().then((err: string) => alert(err));
      })
      // postが成功しても失敗しても、Loaderをオフにする
      .finally(() => setLoading(false));
  }

  // サーバから帰ってきたzip(blob)をダウンロードする。
  // blobをリンク化し、aタグ(非表示、ダウンロード属性)のhrefに設定。
  // click時処理を呼び出してダウンロードさせる。
  // chatGPTに確認したら悪いやり方ではない模様。
  function download(data: Blob) {
    if (!anchor.current) return;
    const ref = anchor.current;
    const url = URL.createObjectURL(data);
    ref.href = url;
    ref.click();
  }

  // unmount時、blobから作成したurlを削除する（メモリ解放目的。good practice.）。
  useEffect(() => {
    return (() => {
      if (!anchor.current) return;
      URL.revokeObjectURL(anchor.current.href);
    });
  }, []);

  return (
    <>
      <MyHead
        title="スマホ画像切取君"
        description={DESC}
        breadCrumbsJSON_ld={breadCrumbFromPath(router)}
      />
      <Menu iniMode={MODE.PRODUCTION}></Menu>
      {isLoading && <Loader text="ナウ、ローディン..."></Loader>}
      <Layout>
        <Main>
          <div className={styles.root}>
            <div className={styles.container}>
              <h1 className={`${styles.center} ${styles.mainHeader}`}>縦長写真を選択した縦横比で切り取るサービス</h1>
              <a className={styles.hide} ref={anchor} download="zen-crop.zip"></a>
              <form onSubmit={submit} action={ENDPOINT} method="post" encType="multipart/form-data">
                <fieldset className={styles.fieldWrapper}>
                  <legend>画像選択</legend>
                  <label htmlFor="pics"></label>
                  <input ref={fileInput} type="file" name="pics" accept="image/*" multiple />
                </fieldset>
                <fieldset className={styles.fieldWrapper}>
                  <legend>縦横比を選択</legend>
                  <input onChange={changeRatio} id="widest" type="radio" name="ratio" value="0.5625" checked={ratio === "0.5625"} />
                  <label htmlFor="widest">9:16</label>
                  <input onChange={changeRatio} id="wider" type="radio" name="ratio" value="0.667" checked={ratio === "0.667"} />
                  <label htmlFor="wider">2:3</label>
                  <input onChange={changeRatio} id="wide" type="radio" name="ratio" value="0.75" checked={ratio === "0.75"} />
                  <label htmlFor="wide">3:4</label>
                  <input onChange={changeRatio} id="square" type="radio" name="ratio" value="1" checked={ratio === "1"} />
                  <label htmlFor="square">1:1</label>
                </fieldset>
                <fieldset className={styles.fieldWrapper}>
                  <legend>リサイズ後の横幅のピクセル数を入力</legend>
                  <input onChange={changeResize} id="default" type="radio" name="resize" value="default" checked={resize === "default"} />
                  <label htmlFor="default">default</label>
                  <input onChange={changeResize} id="new-width" type="radio" name="resize" value="custom" checked={resize === "custom"} />
                  <input onChange={changeCustomWidth} onFocus={focus} id="new-width"
                    type="number" name="width" min="1" max="9999" value={customWidth} />
                  <label htmlFor="new-width">px</label>
                </fieldset>
                <input className={styles.fancyButton} type="submit" value="切取開始" />
              </form>
              <section>
                <h3>使い方</h3>
                <p>
                  スマホで撮影した縦長の画像を、選択した縦横比に基づいて切り取ります。下の赤枠のように、縦方向は中央部分を切り取ります。切り取り後の画像の
                  大きさを変えたい場合は、リサイズ後の横幅をピクセル数で入力してください。
                </p>
                <div className={styles.imageWrapper}>
                  <img className={styles.image} src="/html/cropper/view.jpg" alt="example-image" />
                </div>
              </section>
              <section>
                <h3>注意事項</h3>
                <p>画像はサーバにアップロードされ、切取り後に圧縮の上ダウンロードを行います。
                  通信はHTTPSで暗号化され、安心安全の日本企業のVPSを利用しておりますが、ご了承の上ご利用下さい。
                </p>
              </section>
            </div>
          </div>
        </Main>
        <Side addStyle={styles.sideContainer}>
          <Author name="全力君" postedDate="2023/1/15"></Author>
          <Twitter></Twitter>
        </Side>
      </Layout>
      <Footer></Footer>
    </>
  );
}