import MyHead from "../component/MyHead";
import Footer from "../component/Footer";
import styles from "../styles/Admin.module.css";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { GetServerSidePropsContext } from "next";
import { isAdmin } from "../lib/db/func";

import type { BlogInfo } from "../types";
import type { UpdateItem, UpdateItemRequest } from "../types";

/**Description
 * Blog アップロード用Page
 * 
 * <input type="file">はuncontrolled Componentと呼ばれるらしく
 * onChange = {e=>e.target.file}でファイルを取得するのは予期せぬ動作をする？可能性がある模様。
 * なのでそこだけ`ref`に入れて置き、submit時にref.current.filesでファイル名を取得している。
 */

interface ThumbP {
  updateThumb: (name: string) => void,
}

interface RefP {
  elemRef: React.RefObject<HTMLInputElement>,
}

// blog: 記事登録モード keyword: キーワード登録モード
type Mode = "blog" | "update";

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
 * ブログ一覧からキーワード（重複なし）を抽出して返す関数
 * @param docs 
 * @returns 
 */
function keywordList(docs: BlogInfo[]) {
  const kw: string[] = [];
  for (const doc of docs) {
    if (!doc.keywords) continue;
    kw.push(...doc.keywords)
  }
  const kwSet = new Set(kw);
  const kwArr = Array.from(kwSet);
  return kwArr.sort();
}


let _blogs: BlogInfo[] | null // dbから取得したblogのdocuments。memoization;


export default function Admin() {

  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [dir, setDir] = useState("");
  const [thumb, setThumb] = useState("");
  const [summary, setSummary] = useState("");
  const [title, setTitle] = useState("");
  const [isForce, setForce] = useState(false);
  const [mode, setMode] = useState<Mode>("blog");
  // KeywordListのstateをliftしたもの。入力チェックのため。
  const [keywords, setKeywords] = useState<string[] | null>(null);
  // 現時点のブログ一覧
  const [currentBlogs, setCurrentBlogs] = useState<BlogInfo[] | null>(_blogs);
  // file inputのrefを保持する変数
  const fileInput = useRef<HTMLInputElement>(null);

  // 初回ロードのみ実行
  useEffect(() => {
    if (_blogs) return; // memoが存在する場合はリターン
    console.log("useEffect called!", _blogs)
    // blog一覧をfetch
    fetch("/api/admin/blogs", {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) {
          // 200系以外はエラー→.catchへ
          const emsg = await res.text();
          throw new Error(emsg);
        }
        return res.json()
      })
      .then((data: BlogInfo[]) => {
        _blogs = data;
        setCurrentBlogs(data);
        // keyword一覧も更新
        const kwlist = keywordList(data);
        setKeywords(kwlist);
      })
      .catch(err => alert(err));
  }, [])


  useEffect(() => {
    fetch("/api/admin")
      .then(res => res.json())
      .then(data => {
        setGenres(data["genre"]);
        setGenre(data["genre"][0]);
      });
  }, []);

  const updateThumb = (name: string) => setThumb(name);

  const onsubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //defaultのformイベントを無効か

    //チェック開始***********************
    if (fileInput.current === null) {
      return;
    }
    const files = fileInput.current.files;
    if (files === null || files.length === 0) {
      alert("ファイルが選択されていない？")
      return;
    }

    const fnames = Array.from(files).map(file => file.name);
    if (!checkExt(fnames) || !hasMd(fnames) || !doesThumbMatch(thumb, fnames)) {
      return;
    }

    if (dir === "" || title === "" || summary === "") {
      alert("保存先、タイトル、概要はすべて入力必要です");
      return;
    }

    //チェック終了。ここから下はエラーなし**********
    const formData = new FormData();
    // file以外のformを設定
    const md = getMdFile(fnames);
    const data = {
      "genre": genre,
      "dir": dir,
      "thumb": thumb,
      "title": title,
      "summary": summary,
      "md": md,
      "isForce": isForce.toString(),
    };

    for (const [key, val] of Object.entries(data)) {
      formData.append(key, val);
    }

    // fileをformDataに設定
    Array.from(files).map(file => formData.append("uploads", file, file.name))

    fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    })
      .then(res => res.text())
      .then(data => alert(data))
      .catch(err => alert(err))
  };

  const testBuild = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fetch("/api/admin/testbuild", {
      method: "POST"
    })
  };

  // モード切替用関数
  const modeClicked = (e: React.MouseEvent<HTMLButtonElement>, selectedMode: Mode) => setMode(selectedMode);

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
      <MyHead title="全力ブログ・システム"></MyHead>
      <div className={styles.header}><h1 className={styles.title}>全力ブログ・システム</h1></div>
      <div className={styles.dummyBody}>
        <KeywordList list={keywords} update={setKeywords} />
        <main className={styles.container}>
          <div className={styles.modeContainer}>
            <button
              onClick={e => modeClicked(e, "blog")}
              className={mode === "blog" ? `${styles.modeButton} ${styles.underline}` : styles.modeButton}>
              ブログ登録
            </button>
            <button
              onClick={e => modeClicked(e, "update")}
              className={mode === "update" ? `${styles.modeButton} ${styles.underline}` : styles.modeButton}>
              更新
            </button>
          </div>
          {mode === "blog" &&
            <form action="/api/admin/upload" method="post" encType="multipart/form-data" onSubmit={onsubmit}>
              <ol className={styles.listContainer}>

                <li className={styles.items}>
                  <label className={styles.label} htmlFor="genre" >ジャンル</label>
                  <select id="genre" name="genre" className={styles.genre} value={genre} onChange={e => setGenre(e.target.value)}>
                    {genres.map((genre, i) => <option key={i}>{genre}</option>)}
                  </select>
                </li>

                <li className={styles.items}>
                  <label className={styles.label} htmlFor="assets">保存先ディレクトリ</label>
                  <div className={styles.caution}>ディレクトリは手入力してください。頭の&quot/&quotは入れなくてよいです。例：202201_1/。</div>
                  <input id="assets" type="text" name="assetsDir" value={dir} className={styles.dir} onChange={e => setDir(e.target.value)} />
                </li>

                <li className={styles.items}>
                  <label className={styles.label} htmlFor="title">タイトル</label>
                  <input id="title" type="text" name="title" value={title} className={styles.blogTitle} onChange={e => setTitle(e.target.value)} />
                </li>

                <li className={styles.items}>
                  <label className={styles.label} htmlFor="summary">概要</label>
                  <textarea id="summary" name="summary" value={summary} className={styles.summary} onChange={e => setSummary(e.target.value)}></textarea>
                </li>

                <Uploader updateThumb={updateThumb} elemRef={fileInput}></Uploader>

                <li className={styles.items}>
                  <label className={styles.label} htmlFor="thumb">サムネのファイル名</label>
                  <div className={styles.caution}>ファイル名は手入力してください。アップロードファイル名をクリックすると自動セットされるよ。無い場合は何も入力しないでください。</div>
                  <input id="thumb" type="text" name="thumb" value={thumb} onChange={e => setThumb(e.target.value)} />
                </li>

                <li className={styles.items}>
                  <input id="force" type="checkbox" name="force" checked={isForce} onChange={e => setForce((force) => !force)} />
                  <label htmlFor="force" >同じフォルダ名が存在する場合、上書きする。</label>
                </li>

                <li className={styles.items}>
                  <label className={styles.label} htmlFor="submit">送信</label>
                  <input id="submit" className={styles.submit} type="submit" value="submit" />
                </li>

                <input type="text" name="md" className={styles.hidden}></input>
                {/* <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.preventDefault(); console.log(genre) }}>TEST!</button> */}
                <button onClick={testBuild}>Buildテスト</button>
              </ol>
            </form>
          }
          {mode === "update" &&
            <UpdateMode
              genres={genres}
              checkNewKeyword={checkNewKeyword}
              updateKeywords={setKeywords}
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

function FileList(props: { data: string[] } & ThumbP) {

  const { data, updateThumb } = props;

  const click = (e: React.MouseEvent<HTMLButtonElement>, name: string) => {
    e.preventDefault();
    updateThumb(name);
  };

  return (
    <div>
      {data.map((name, i) => <button className={styles.filenames} key={i} onClick={(e) => click(e, name)}>{name}</button>)}
    </div>
  );
}


interface UpdateModeProp {
  genres: string[],
  checkNewKeyword(c: string[]): boolean,
  currentBlogs: BlogInfo[] | null,
  reload: React.Dispatch<React.SetStateAction<BlogInfo[] | null>>,
  updateKeywords: React.Dispatch<React.SetStateAction<string[] | null>>
}
function UpdateMode({
  genres, checkNewKeyword, updateKeywords, currentBlogs, reload
}: UpdateModeProp) {
  return (
    <>
      <h1 style={{ "textAlign": "center" }}>更新モードの解説</h1>
      <p>
        ブログページに表示されるタイトルとサマリの更新モード。キーワードの追加と更新もここで行う。記事単位で更新が可能。
        キーワードはカンマ区切りで入力し、"["と"]"で囲う必要はない。
        まとめての更新は今は非対応。後日追加するかも。
      </p>
      {
        currentBlogs
          ?
          <ol className={styles.listContainer}>
            {currentBlogs.map((blog, i) => <Blog {...blog} genres={genres} reload={reload} checkNewKeyword={checkNewKeyword} updateKeywords={updateKeywords} key={i} />)}
          </ol>
          :
          <div style={{ textAlign: "center", height: "500px", fontSize: "2rem", color: "white" }}>LOADING...</div>
      }
    </>
  );
}

interface BlogItemProp extends BlogInfo {
  genres: string[],
  reload: React.Dispatch<React.SetStateAction<BlogInfo[] | null>>,
  checkNewKeyword(c: string[]): boolean,
  updateKeywords: React.Dispatch<React.SetStateAction<string[] | null>>
}

function Blog({
  assetsDir, title, summary, genre, genres, keywords, reload,
  checkNewKeyword, updateKeywords,
}: BlogItemProp) {
  // ["a","b"] => "a,b"に変換。[]なら""に変換
  const keywordsStr = keywords ? keywords.join(",") : "";
  // from controllのために使う
  const [titleInput, setTitleInput] = useState<string>(title);
  const [summaryInput, setSummaryInput] = useState<string>(summary);
  const [genreInput, setGenreInput] = useState<string>(genre);
  const [keywordsInput, setKeywrodsInput] = useState<string>(keywordsStr);
  // 変更判別用
  const [isTitleChanged, setIsTitleChanged] = useState<boolean>(false);
  const [isSummaryChanged, setIsSummaryChanged] = useState<boolean>(false);
  const [isGenreChanged, setIsGenreChanged] = useState<boolean>(false);
  const [isKeywordsChanged, setIsKeywordsChanged] = useState<boolean>(false);

  // タイトルを変更した時に呼び出される
  const titleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // controll input element
    setTitleInput(e.target.value);
    // 入力値がDB値と一致していればfalse、不一致ならtrue
    setIsTitleChanged(e.target.value !== title);
  };

  // サマリを変更した時に呼び出される
  const summaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // controll textarea element
    setSummaryInput(e.target.value);
    // 入力値がDB値と一致していればfalse、不一致ならtrue
    setIsSummaryChanged(e.target.value !== summary);
  }

  // ジャンルを変更した時に呼び出される
  const genreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreInput(e.target.value);
    setIsGenreChanged(e.target.value !== genre);
  }

  const keywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywrodsInput(e.target.value);
    setIsKeywordsChanged(e.target.value !== keywordsStr);
  }

  // 値を戻す
  const undo = () => {
    setTitleInput(title);
    setSummaryInput(summary);
    setGenreInput(genre);
    setKeywrodsInput(keywordsStr);
    // 色も戻す
    defaultColor();
  };

  // 変更色を戻す
  const defaultColor = () => {
    setIsTitleChanged(false);
    setIsSummaryChanged(false);
    setIsGenreChanged(false);
    setIsKeywordsChanged(false);
  };

  const commit = async () => {
    const data: UpdateItem = {};
    // 変更が無い場合は何もしない。
    if (!isSummaryChanged && !isTitleChanged
      && !isGenreChanged && !isKeywordsChanged
    ) {
      alert("何も変更されていません。")
      return;
    }

    const kwArr = keywordsInput.split(",");
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
      // keyword更新
      const kwlist = keywordList(blogs);
      updateKeywords(kwlist);
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
          {genres.map((v, i) => <option key={i}>{v}</option>)}
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

interface KeywordListProp {
  list: string[] | null;
  update: React.Dispatch<React.SetStateAction<string[] | null>>
}
function KeywordList({ list, update }: KeywordListProp) {
  // const [keywords, setKeywords] = useState<string[] | null>(null);
  // useEffect(() => {
  //   fetch("/api/admin/keyword-list")
  //     .then(res => {
  //       if (!res || !res.ok) {
  //         throw new Error("Something went wrong...Could not get keyword list!")
  //       }
  //       return res.json()
  //     })
  //     .then((data: string[]) => update(data.sort()))
  //     .catch(err => alert(err))
  // }, []);

  return (
    <aside
      style={{
        "backgroundColor": "#333", "color": "white",
        "paddingRight": "1rem", "position": "fixed", "alignSelf": "flex-start", "top": "0px",
        "height": "100vh", "paddingTop": "3rem"
      }}
    >
      <div style={{ textAlign: "center" }}>キーワード一覧</div>
      {
        list
          ?
          <ul>
            {list.map((kw, i) => <li key={i}>{kw}</li>)}
          </ul>
          :
          <div>loading...</div>
      }
    </aside>
  );
}

/*************************************************
 * SSR　サーバ側の処理な点に留意。
 * @param context リクエストを操作するためのオブジェクト
 * @returns 
 **************************************************/
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