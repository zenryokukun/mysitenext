import MyHead from "../component/MyHead";
import Footer from "../component/Footer";
import styles from "../styles/Admin.module.css";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { GetServerSidePropsContext } from "next";
import { isAdmin } from "../lib/db/func";

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

function getMdFile(fnames: string[]): string {
  for (const name of fnames) {
    if (name.slice(-3) === ".md") {
      return name;
    }
  }
  return "";
}

export default function Admin() {

  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [dir, setDir] = useState("");
  const [thumb, setThumb] = useState("");
  const [summary, setSummary] = useState("");
  const [title, setTitle] = useState("");
  const [isForce, setForce] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <MyHead title="全力ブログ・システム"></MyHead>
      <div className={styles.header}><h1 className={styles.title}>全力ブログ・システム</h1></div>
      <div className={styles.dummyBody}>
        <main className={styles.container}>
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