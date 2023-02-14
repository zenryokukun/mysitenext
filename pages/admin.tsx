import MyHead from "../component/MyHead";
import Footer from "../component/Footer";
import styles from "../styles/Admin.module.css";
import React, { useState, useRef, useReducer, FormEvent, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { isAdmin } from "../lib/db/func";
import { useBlogs } from "../lib/admin/use-blogs";
import { ACTIONS, blogItemReducer } from "../lib/admin/blog-reducer";
import { useBlogForm, ACTIONS as FORM_ACTIONS } from "../lib/admin/use-blog-form";

import type { Target } from "../lib/admin/use-blog-form";
import type { BlogInfo } from "../types";
import type { UpdateItem, UpdateItemRequest } from "../types";
import type { WithId } from "mongodb";
/**Description
 * Blog アップロード用Page
 * 
 * <input type="file">はuncontrolled Componentと呼ばれるらしく
 * onChange = {e=>e.target.file}でファイルを取得するのは予期せぬ動作をする？可能性がある模様。
 * なのでそこだけ`ref`に入れて置き、submit時にref.current.filesでファイル名を取得している。
 */

interface ThumbP {
  updateThumb: (key: "thumb", name: string) => void,
}

interface RefP {
  elemRef: React.RefObject<HTMLInputElement>,
}

/**
 * 拡張子をチェックする。画像系の拡張子（小文字）、mdファイル以外の拡張死はエラーにする。
 * .JPG、.PNG等の大文字の拡張子はエラーにする、Linuxだと小文字に変換されるようなので。
 * @param fnames ファイル名のリスト
 * @returns 
 */
function checkExt(fnames: string[]): boolean {
  const allowed = ["jpg", "jpeg", "png", "gif", "tif", "tiff", "md"];
  for (const name of fnames) {
    // "."が1つの場合は拡張子なしなので空文字にしてマッチしないようにする。
    // "."が複数ある場合も想定し、2以上の場合は最後の要素を設定する。
    const _ext = name.split(".");
    const ext = _ext.length > 1 ? _ext.slice(-1)[0] : "";
    if (!allowed.includes(ext)) {
      alert(`${name}は画像でもmdファイルでもありません!!後、大文字の拡張子はダメです！`)
      return false;
    }
  }
  return true;
}

/**
 * .mdファイルが含まれているかチェック
 * @param fnames ファイル名のリスト
 * @returns 
 */
function hasMd(fnames: string[]): boolean {
  for (const name of fnames) {
    if (name.slice(-3) === ".md") {
      return true;
    }
  }
  alert("mdファイルがありません");
  return false;
}

/**
 * サムネがファイルのリストに含まれているかチェック
 * サムネ無しの場合はエラーなしとして処理する
 * @param thumb サムネ名
 * @param fnames ファイル名のリスト
 * @returns 
 */
function doesThumbMatch(thumb: string, fnames: string[]): boolean {
  if (thumb === "") {
    return true; //サムネ無しも許容。
  }
  if (fnames.includes(thumb)) {
    return true;
  }
  alert(`サムネ名がファイルとが一致しません。:${thumb}`)
  return false;
}

/**
 * [ファイル名]の配列から.mdで終わるファイル名を返す。
 * .mdは1つしか想定していないため、複数ある場合は最初の.mdを返す
 * @param fnames : string[]
 * @returns 最初の.mdファイルのファイル名
 */
function getMdFile(fnames: string[]): string {
  for (const name of fnames) {
    if (name.slice(-3) === ".md") {
      return name;
    }
  }
  return "";
}

/**
 * 頭と末尾の不要な区切り文字を削除する。"a,b,c,,," -> "a,b,c"
 * @param s 
 */
function moldKeywords(s: string, delims: string = ",") {
  while (s.slice(-1) === delims) {
    s = s.slice(0, -1);
  }
  while (s.slice(0, 1) === delims) {
    s = s.slice(1);
  }
  return s;
}

/***********************************************************************
 * Admin : 最上位Component。Component
 * `mode` stateによってInsertMode Component、UpdateMode Componentを表示。
 * KeywordList Componentはどちらのモードでも利用するため、Adminで表示する。
 ***********************************************************************/

type Mode = "insert" | "update"

export default function Admin() {
  const [mode, setMode] = useState<Mode>("insert");
  const [genreList, setGenreList] = useState<string[]>([]);
  // blog一覧とキーワード一覧を取得する。
  // blogモード、updateモードで共有するstateな点に留意。
  const { currentBlogs, setCurrentBlogs, keywords, setKeywords } = useBlogs();

  const switchMode = (newMode: Mode) => setMode(newMode);

  useEffect(() => {
    fetch("/api/admin")
      .then(res => res.json())
      .then((data) => {
        setGenreList(data["genre"]);
      })
  }, [])

  // 新しいkeyword登録を判定する関数
  const checkNewKeyword = (newKeywords: string[]) => {
    // nullならまだfetchが終わっていないのでエラーにしとく。
    if (!keywords) throw new Error("keywords list is null! Wait 'til it loads!");
    // keywordsリストに存在しなければtrue（新しいkeywrod）を返す。
    for (let i = 0; i < newKeywords.length; i++) {
      const w = newKeywords[i];
      if (!keywords.includes(w)) {
        return true;
      }
    }
    // ここまでくれば新キーワードは全て既存のもの。
    return false;
  }

  return (
    <>
      <MyHead title="全力ブログ・システム" useBreadCrumb={false}></MyHead>
      <div className={styles.header}><h1 className={styles.title}>全力ブログ・システム</h1></div>
      <div className={styles.dummyBody}>
        <KeywordList list={keywords} />
        <main className={styles.container}>
          <div className={styles.modeContainer}>
            <button
              onClick={e => switchMode("insert")}
              className={mode === "insert" ? `${styles.modeButton} ${styles.underline}` : styles.modeButton}>
              ブログ登録
            </button>
            <button
              onClick={e => switchMode("update")}
              className={mode === "update" ? `${styles.modeButton} ${styles.underline}` : styles.modeButton}>
              更新
            </button>
          </div>
          {mode === "insert" &&
            <InsertMode
              reload={setCurrentBlogs}
              checkNewKeyword={checkNewKeyword}
              genreList={genreList}
            />
          }
          {mode === "update" &&
            <UpdateMode
              genreList={genreList}
              checkNewKeyword={checkNewKeyword}
              reload={setCurrentBlogs}
              currentBlogs={currentBlogs}
            />
          }
        </main>
      </div>
      <Footer></Footer>
    </>
  );
}

/************************************************************************
 * InsertMode Component。`mode`が"insert"の時に表示。
 * ブログの新規Insert（アップロード）を行う。保存先が同じ場合は、
 * 上書きでアップロードすることも可能。
 * DBの登録とサーバにフォルダを作成を行うので、submitの前に良く確認すること。
 /***********************************************************************/
interface InsertModeProp {
  genreList: string[]
  checkNewKeyword(c: string[]): boolean,
  reload: React.Dispatch<React.SetStateAction<BlogInfo[] | null>>,
}

// /api/admin/uploadのresponseボデーの型。application/json。
interface UploadResponse {
  blogs: WithId<BlogInfo>[]; // uploadを反映したブログ一覧
  msg: string; // 成功メッセージ
}

export function InsertMode({ genreList, checkNewKeyword, reload }: InsertModeProp) {

  const { state, dispatch } = useBlogForm((genreList && genreList.length > 0) ? genreList[0] : "");
  const { genre, dir, thumb, summary, title, isForce, keywordsInput } = state;
  // file inputのrefを保持する変数
  const fileInput = useRef<HTMLInputElement>(null);

  const keyChanged = (key: Target, val: (string | boolean)) => {
    dispatch({
      type: FORM_ACTIONS.CHANGE,
      payload: {
        change: { target: key, value: val }
      }
    });
  }

  const onsubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //defaultのformイベントを無効か

    //チェック開始***********************
    if (fileInput.current === null) {
      return;
    }
    // fileが取得出来ない場合はエラー
    const files = fileInput.current.files;
    if (files === null || files.length === 0) {
      alert("ファイルが選択されていない？")
      return;
    }

    // ファイル名チェック。画像拡張子、mdファイルが存在するか、サムネが一覧に含まれるかをチェック。
    const fnames = Array.from(files).map(file => file.name);
    if (!checkExt(fnames) || !hasMd(fnames) || !doesThumbMatch(thumb, fnames)) {
      return;
    }

    // 必須項目チェック
    if (dir === "" || title === "" || summary === "") {
      alert("保存先、タイトル、概要はすべて入力必要です");
      return;
    }

    // 入力したkeywordsを配列に変換する。未入力の場合は空配列にする。
    // 新しいkeywordがある場合、確認メッセージを出す。
    // キャンセルを押した場合は何もせず戻る。
    let _kw = keywordsInput || "";
    _kw = moldKeywords(_kw);
    let _kwArr = _kw.length === 0 ? [] : _kw.split(",")
    if (_kwArr.length > 0 && checkNewKeyword(_kwArr)) {
      if (!confirm("新しいパスワードが含まれます。登録して良いですか？")) {
        return;
      }
    }

    //チェック終了。ここから下はエラーなし**********
    const formData = new FormData();
    // file以外のformを設定
    const md = getMdFile(fnames);
    // postするデータ。multipart/form-dataとなるため、
    // booleanや配列は文字列に変換する。適宜サーバでparseする。
    const data = {
      "genre": genre,
      "dir": dir,
      "thumb": thumb,
      "title": title,
      "summary": summary,
      "md": md,
      "isForce": isForce.toString(),
      "keywords": JSON.stringify(_kwArr),
    };

    for (const [key, val] of Object.entries(data)) {
      formData.append(key, val);
    }

    // fileをformDataに設定
    Array.from(files).map(file => formData.append("uploads", file, file.name))

    // upload。responseでuploadを反映した最新のブログ情報が帰ってくる。
    fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    })
      // .then(res => res.text())
      // .then(data => alert(data))
      .then(res => res.json())
      .then((data: UploadResponse) => {
        const { blogs, msg } = data;
        if (!blogs || blogs.length === 0) throw new Error("Could not get new blogs. Please check your DB.")
        reload(blogs); // 最新のブログ情報で更新
        alert(msg);
      })
      .catch(err => alert(err))
  };

  // const testBuild = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   fetch("/api/admin/testbuild", {
  //     method: "POST"
  //   })
  // };

  return (
    <>
      <h2 style={{ "textAlign": "center" }}>挿入（アップロード）モードの解説</h2>
      <p>
        新規ブログを挿入するモード。上書きのチェックボックスをオンにすれば、既存のフォルダを削除して再アップロードしてくれる。
        submitボタンを押すと、DBへの挿入と、/public/postsにフォルダが作成される。テストの際には注意すること。
      </p>
      <form action="/api/admin/upload" method="post" encType="multipart/form-data" onSubmit={onsubmit}>
        <ol className={styles.listContainer}>

          <li className={styles.items}>
            <label className={styles.label} htmlFor="genre" >ジャンル</label>
            <select id="genre" name="genre" className={styles.genre} value={genre} onChange={e => keyChanged("genre", e.target.value)}>
              {genreList.map((genre, i) => <option key={i}>{genre}</option>)}
            </select>
          </li>

          <li className={styles.items}>
            <label className={styles.label} htmlFor="assets">保存先ディレクトリ</label>
            <div className={styles.caution}>ディレクトリは手入力してください。頭の/(slash)は入れなくてよいです。例：202201_1。</div>
            <input id="assets" type="text" name="assetsDir" value={dir} className={styles.dir} onChange={e => keyChanged("dir", e.target.value)} />
          </li>

          <li className={styles.items}>
            <label className={styles.label} htmlFor="title">タイトル</label>
            <input id="title" type="text" name="title" value={title} className={styles.blogTitle} onChange={e => keyChanged("title", e.target.value)} />
          </li>

          <li className={styles.items}>
            <label className={styles.label} htmlFor="summary">概要</label>
            <textarea id="summary" name="summary" value={summary} className={styles.summary} onChange={e => keyChanged("summary", e.target.value)}></textarea>
          </li>

          <Uploader updateThumb={keyChanged} elemRef={fileInput}></Uploader>

          <li className={styles.items}>
            <label className={styles.label} htmlFor="thumb">サムネのファイル名</label>
            <div className={styles.caution}>ファイル名は手入力してください。アップロードファイル名をクリックすると自動セットされるよ。無い場合は何も入力しないでください。</div>
            <input id="thumb" type="text" name="thumb" value={thumb} onChange={e => keyChanged("thumb", e.target.value)} />
          </li>

          <li className={styles.items}>
            <input id="force" type="checkbox" name="force" checked={isForce} onChange={e => keyChanged("isForce", !isForce)} />
            <label htmlFor="force" >同じフォルダ名が存在する場合、上書きする。</label>
          </li>

          <li className={styles.items}>
            <label className={styles.label} htmlFor="keywords">キーワード</label>
            <input id="keywords" type="text" name="keywords" value={keywordsInput} onChange={e => keyChanged("keywordsInput", e.target.value)} />
          </li>

          <li className={styles.items}>
            <label className={styles.label} htmlFor="submit">送信</label>
            <input id="submit" className={styles.submit} type="submit" value="submit" />
          </li>

          <input type="text" name="md" className={styles.hidden}></input>
          {/* <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); console.log(genre) }}>TEST!</button> */}
          {/* <button onClick={testBuild}>Buildテスト</button> */}
        </ol>
      </form>
    </>
  );
}


/**********************************************************************
 * InsertModeの下位Component。アップロードファイルの選択をする。
 **********************************************************************/
function Uploader(props: ThumbP & RefP) {

  const { updateThumb, elemRef } = props;
  const [names, setNames] = useState<string[]>([]);

  const getFileNames = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files !== null) {
      const fileList = Array.from(files).map(file => file.name);
      setNames(fileList);
    }
  };

  return (
    <li className={styles.items}>
      <label className={styles.label} htmlFor="files">アップロードするファイル</label>
      <div className={styles.caution}>日本語はサーバ側で文字化けしちゃう( ﾉД`)ｼｸｼｸ…</div>
      <input ref={elemRef} className={styles.btn} type="file" name="uploads" multiple onChange={getFileNames} id="files" />
      <FileList data={names} updateThumb={updateThumb}></FileList>
    </li>
  );
}


/**********************************************************************
 * Uploaderの下位Component。アップロードファイルの名前を一覧で表示する。
 **********************************************************************/
function FileList(props: { data: string[] } & ThumbP) {

  const { data, updateThumb } = props;

  const click = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
    e.preventDefault();
    if (name.endsWith(".md")) {
      alert("mdファイルはサムネに出来ません")
      return;
    }
    updateThumb("thumb", name);
  };

  return (
    <div>
      {data.map((name, i) => <button className={styles.filenames} key={i} onClick={(e) => click(e, name)}>{name}</button>)}
    </div>
  );
}


/**********************************************************************
 * UpdateMode Component。Adminで`mode`が"insert"の時に表示。
 * /blogページで表示される情報の修正が可能。titleは実際の記事のtitleでなく、
 * あくまで/blogページに表示される太字な点に留意。
 **********************************************************************/

interface UpdateModeProp {
  genreList: string[],
  checkNewKeyword(c: string[]): boolean,
  currentBlogs: BlogInfo[] | null,
  reload: React.Dispatch<React.SetStateAction<BlogInfo[] | null>>,
}
function UpdateMode({
  genreList, checkNewKeyword, currentBlogs, reload
}: UpdateModeProp) {
  return (
    <>
      <h2 style={{ "textAlign": "center" }}>更新モードの解説</h2>
      <p>
        ブログページに表示されるタイトルとサマリの更新モード。キーワードの追加と更新もここで行う。記事単位で更新が可能。
        キーワードはカンマ区切りで入力し、『[]』で囲う必要はない。
        まとめての更新は今は非対応。後日追加するかも。
      </p>
      {
        currentBlogs
          ?
          <ol className={styles.listContainer}>
            {currentBlogs.map((blog, i) => <Blog {...blog} genreList={genreList} reload={reload} checkNewKeyword={checkNewKeyword} key={i} />)}
          </ol>
          :
          <div style={{ textAlign: "center", height: "500px", fontSize: "2rem", color: "white" }}>LOADING...</div>
      }
    </>
  );
}


/************************************************************************
 * Blog Component。UpdateModeの下位Component。
 ************************************************************************/

interface BlogItemProp extends BlogInfo {
  genreList: string[],
  reload: React.Dispatch<React.SetStateAction<BlogInfo[] | null>>,
  checkNewKeyword(c: string[]): boolean,
}

/**
 * Blogごとの情報を更新するためのComponent。
 * @param param [BlogItemProp]assetsDir,title,summary,genre,keywrodsはdb値
 * @returns 
 */
function Blog({
  assetsDir, title, summary, genre, genreList, keywords,
  reload, checkNewKeyword
}: BlogItemProp) {

  // ["a","b"] => "a,b"に変換。[]なら""に変換
  const keywordsStr = keywords ? keywords.join(",") : "";

  // 各stateを設定。**Inputはユーザ入力値。is**Changedは変更フラグ。
  const [state, dispatch] = useReducer(blogItemReducer, {
    titleInput: title, summaryInput: summary,
    genreInput: genre, keywordsInput: keywordsStr,
    isTitleChanged: false, isSummaryChanged: false, isGenreChanged: false, isKeywordsChanged: false,
  })

  // stateからデータをdestruct.
  const {
    titleInput, summaryInput,
    genreInput, keywordsInput,
    isTitleChanged, isSummaryChanged,
    isGenreChanged, isKeywordsChanged
  } = state;

  // タイトルを変更した時に呼び出される
  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.TITLE, payload: { titleInput: e.target.value, dbTitle: title } })
  };

  // サマリを変更した時に呼び出される
  const summaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.SUMMARY, payload: { summaryInput: e.target.value, dbSummary: summary } })
  }

  // ジャンルを変更した時に呼び出される
  const genreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.GENRE, payload: { genreInput: e.target.value, dbGenre: genre } })
  }

  const keywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch({ type: ACTIONS.KEYWORDS, payload: { keywordsInput: e.target.value, dbKeywords: keywordsStr } })
  }

  // 値を戻す
  const undo = () => {
    // db値をユーザ入力値に設定することで元に戻す。
    dispatch({
      type: ACTIONS.UNDO,
      payload: {
        titleInput: title,
        summaryInput: summary,
        genreInput: genre,
        keywordsInput: keywordsStr
      }
    })
  };

  // 変更色を戻す
  const defaultColor = () => {
    dispatch({ type: ACTIONS.UN_COLOR, payload: {} });
  };

  const commit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const data: UpdateItem = {};
    // 変更が無い場合は何もしない。
    if (!isSummaryChanged && !isTitleChanged
      && !isGenreChanged && !isKeywordsChanged
    ) {
      alert("何も変更されていません。")
      return;
    }

    const kwStr = moldKeywords(keywordsInput);
    const kwArr = kwStr.split(",");
    // 入力ミス確認のため、新キーワードの場合は確認ダイアログを表示
    if (checkNewKeyword(kwArr)) {
      if (!confirm("新しいパスワードが含まれます。登録して良いですか？")) {
        return;
      }
    }

    if (isSummaryChanged) {
      data["summary"] = summaryInput;
    }
    if (isTitleChanged) {
      data["title"] = titleInput;
    }
    if (isGenreChanged) {
      data["genre"] = genreInput;
    }
    if (isKeywordsChanged) {
      data["keywords"] = kwArr;
    }
    // サーバ送信
    const requestData: UpdateItemRequest = {
      updateKey: { assetsDir },
      data: data,
    };

    try {
      const resp = await fetch("/api/admin/update-one", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(requestData),
      })
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg)
      }
      const blogs = await resp.json();
      alert("Update succeeded!")
      // ブログを更新
      reload(blogs);
      // 色戻す
      defaultColor();
    } catch (err) {
      alert(err);
    }
  };

  // 入力値の変更あり・なしに応じたstyleを返す関数。
  const resolveStyle = (defaultStyle: string, isChanged: boolean) => {
    if (!isChanged) {
      return defaultStyle;
    }
    return `${defaultStyle} ${styles.changed}`;
  };

  return (
    <li className={styles.items}>
      <div className={styles.updateItem}>
        <div className={styles.label}>ジャンル</div>
        <select
          className={resolveStyle(styles.genre, isGenreChanged)}
          onChange={genreChange}
          value={genreInput}
        >
          {genreList.map((v, i) => <option key={i}>{v}</option>)}
        </select>
      </div>
      <div className={styles.updateItem}>
        <div className={styles.label}>タイトル</div>
        <input
          className={resolveStyle(styles.blogTitle, isTitleChanged)}
          type="text" value={titleInput}
          onChange={titleChange}
        />
      </div>
      <div className={styles.updateItem}>
        <div className={styles.label}>サマリ</div>
        <textarea
          className={resolveStyle(styles.summary, isSummaryChanged)}
          onChange={summaryChange}
          value={summaryInput}
        />
      </div>
      <div className={styles.updateItem}>
        <div className={styles.label}>キーワード</div>
        <input
          className={resolveStyle(styles.blogTitle, isKeywordsChanged)}
          type="text"
          value={keywordsInput}
          onChange={keywordsChange}
        />
      </div>
      <div className={styles.updateItem}>
        <div>保存先: {assetsDir}</div>
      </div>
      <div className={styles.right}>
        <button className={styles.listBtn} onClick={undo}>undo</button>
        <button className={styles.listBtn} onClick={commit}>commit</button>
      </div>
    </li>
  );
}

/************************************************************************
 * Keyword一覧。Adminの下位Component。`mode`にかかわらず、サイドバーとして表示。
 ***********************************************************************/
interface KeywordListProp {
  list: string[] | null;
}

function KeywordList({ list }: KeywordListProp) {

  return (
    <aside
      // style={{
      //   "backgroundColor": "#333", "color": "white",
      //   "paddingRight": "1rem", "position": "fixed", "alignSelf": "flex-start", "top": "0px",
      //   "height": "100vh", "paddingTop": "3rem"
      // }}
      className={styles.keywordWrapper}
    >
      <div className={styles.center}>キーワード一覧</div>
      {
        list
          ?
          <ul className={styles.keywordItemWrapper}>
            {list.map((kw, i) => <li key={i}>{kw}</li>)}
          </ul>
          :
          <div>loading...</div>
      }
    </aside>
  );
}


/*************************************************************************
 * SSR　サーバ側の処理な点に留意。
 * @param context リクエストを操作するためのオブジェクト
 * @returns 
 ************************************************************************/
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { user } = context.req.cookies;
  // 認証されていなければログインページへ
  if (!user || !(await isAdmin(user))) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  //認証OK　渡すものは特にないので空。
  return {
    props: {},
  }
}