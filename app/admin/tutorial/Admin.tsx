"use client";
import { useState, useEffect } from "react";
import Footer from "../../../component/Footer";
import styles from "../../../styles/AdminTutorial.module.css";
import { TutorialRec } from "../../../lib/db/sqlite-types";

const MODE = {
  INSERT: "insert", UPDATE: "update",
}

export default function Admin() {
  const [mode, setMode] = useState(MODE.INSERT);
  // radio button control
  const radioControl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMode(e.target.value);
  }

  return (
    <>
      <div className={styles.container}>
        <header className={styles.heading}>
          <h1 className={styles.headline}>Tutorial Adminテスト</h1>
          <div>チュートリアルを更新するページ</div>
        </header>

        <section className={styles.mode}>
          <div className={styles.modeText}>モード選択</div>
          <label className={styles.textLarge}>
            insert
            <input type="radio" name="mode" value={MODE.INSERT} checked={mode === MODE.INSERT} onChange={radioControl} />
          </label>
          <label className={styles.textLarge}>
            update
            <input type="radio" name="mode" value={MODE.UPDATE} checked={mode === MODE.UPDATE} onChange={radioControl} />
          </label>
        </section>
        {mode === MODE.INSERT
          ? <Insert />
          : mode === MODE.UPDATE
            ? <Update />
            : <>None</>
        }
      </div>
      <Footer />
    </>
  );
}

function Insert() {
  const [slugs, setSlugs] = useState("");
  const [systemPath, setSystemPath] = useState("");
  const [category, setCategory] = useState("");
  const [filename, setFileName] = useState("page.md");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("全力君");
  const [prev, setPrev] = useState("");
  // descriptionの入力文字数。推奨は120文字程度？
  const [count, setCount] = useState(0);

  const keyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  return (
    <section className={styles.formWrapper}>
      <form action="/api/admin/tutorial/insert" method="POST" onKeyDown={e => keyDown(e)} className={styles.form} >
        <div className={styles.formInput}>
          <div>
            <label htmlFor="slugs">/tutorial以降のroutes。カンマ区切り（a,b,c）</label>
            <input id="slugs" type="text" name="slugs" placeholder="SLUGS" required
              value={slugs} onChange={e => setSlugs(e.target.value)} className={styles.singleInput} />
          </div>
          <div>
            <label htmlFor="path">/public/posts移行の格納パス。ex: common/command-line/usage</label>
            <input id="path" type="text" name="systemPath" placeholder="SYSTEM_PATH" required
              value={systemPath} onChange={e => setSystemPath(e.target.value)} className={styles.singleInput} />
          </div>
          <div>
            <label htmlFor="category">「共通」、「Python」のようなカテゴリ</label>
            <input id="category" type="text" name="category" placeholder="CATEGORY" required
              value={category} onChange={e => setCategory(e.target.value)} className={styles.singleInput} />
          </div>
          <div>
            <label htmlFor="filename">page.mdのようなファイル名</label>
            <input id="filename" type="text" name="filename" placeholder="FILENAME" required
              value={filename} onChange={e => setFileName(e.target.value)} className={styles.singleInput} />
          </div>
          <div>
            <label htmlFor="title">ページのタイトル</label>
            <input id="title" type="text" name="title" placeholder="TITLE" required
              value={title} onChange={e => setTitle(e.target.value)} className={styles.singleInput} />
          </div>
          <div>
            <label htmlFor="desc">ページのdescription（80~120文字目安）</label>
            <textarea id="desc" name="description" placeholder="DESCRIPTION" required
              value={description} onChange={e => {
                setDescription(e.target.value);
                setCount(e.target.value.length);
              }} className={styles.singleInput + " " + styles.largeInput} />
            <span className={styles.count}>文字数:{count}</span>
          </div>
          <div>
            <label htmlFor="author">作者名</label>
            <input id="author" type="text" name="author" placeholder="AUTHOR" required
              value={author} onChange={e => setAuthor(e.target.value)} className={styles.singleInput} />
          </div>
          <div>
            <label htmlFor="published">初回投稿日（入力不可）</label>
            <input id="published" type="text" name="published" placeholder="PUBLISHED" className={styles.singleInput} disabled />
          </div>
          <div>
            <label htmlFor="updated">更新日（入力不可）</label>
            <input id="updated" type="text" name="updated" placeholder="UPDATED" className={styles.singleInput} disabled />
          </div>
          <div>
            <label htmlFor="prev">前のページ（任意）</label>
            <input id="prev" type="text" name="prev" placeholder="PREV"
              value={prev} onChange={e => setPrev(e.target.value)} className={styles.singleInput} />
          </div>
        </div>
        <input type="submit" value="submit" className={styles.singleInput + " " + styles.wide + " " + styles.mt} />
      </form>
    </section>
  );
}

function Update() {

  const [data, setData] = useState<TutorialRec[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    fetch("/api/admin/tutorial")
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json()
      })
      .then(recs => setData([...recs]))
  }

  if (data.length === 0) return <div style={{ "fontSize": "1.5rem", "fontWeight": "bold" }}>ローディン...</div>

  return (
    <>
      {data.map((rec, i) => <Item key={i} record={rec} no={i} refresh={refresh} />)}
    </>
  );
}

function Item({ record, no, refresh }: { record: TutorialRec, no: number, refresh: () => void }) {
  const { SLUGS, SYSTEM_PATH, CATEGORY, FILENAME, TITLE, DESCRIPTION, AUTHOR, PUBLISHED, UPDATED, PREV } = record;
  const [slugs, setSlugs] = useState(SLUGS);
  const [systemPath, setSystemPath] = useState(SYSTEM_PATH);
  const [category, setCategory] = useState(CATEGORY);
  const [filename, setFileName] = useState(FILENAME);
  const [title, setTitle] = useState(TITLE);
  const [description, setDescription] = useState(DESCRIPTION);
  const [author, setAuthor] = useState(AUTHOR);
  const [published, setPublished] = useState(PUBLISHED);
  const [updated, setUpdated] = useState(UPDATED);
  const [prev, setPrev] = useState(PREV);
  // descriptionの入力文字数。推奨は120文字程度？
  const [count, setCount] = useState(DESCRIPTION.length);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // formの入力値をformData型に変換
    const param = {
      slugs, systemPath, category, filename, title,
      description, author, published, updated, prev,
      // db登録されているSLUGS（更新条件のため、画面内容にかかわらず必要）
      dbslugs: SLUGS,
    };

    const formdata = new FormData();
    for (const [key, val] of Object.entries(param)) {
      formdata.append(key, val);
    }

    fetch("/api/admin/tutorial/update", {
      method: "POST",
      // x-www-form-urlencodedだとうまくいかないのでコメントアウト。
      // FormDataはmultipart/form-dataがデフォルトのもよう？
      // headers: {"Content-Type": "application/x-www-form-urlencoded},
      body: formdata,
    })
      .then(res => res.text())
      .then(text => {
        alert(text);
        refresh();
      });
  };

  // formでenterを押すとsubmitされてしまうのを防ぐ
  const keyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <section className={styles.formWrapper + " " + styles.row}>
      <div className={styles.itemLabel}>No{no + 1}</div>
      <form action="/api/admin/tutorial/update" method="POST"
        onSubmit={submit} onKeyDown={e => keyDown(e)} className={styles.form + " " + styles.col} >
        <div className={styles.formInput}>
          <div>
            <label htmlFor="slugs">/tutorial以降のroutes。カンマ区切り</label>
            <input id="slugs" type="text" name="slugs" placeholder="SLUGS" required
              value={slugs} onChange={e => setSlugs(e.target.value)} className={slugs === SLUGS ? styles.singleInput : styles.inputChange} />
          </div>
          <div>
            <label htmlFor="path">/public/posts移行の格納パス。ex: common/command-line/usage</label>
            <input id="path" type="text" name="systemPath" placeholder="SYSTEM_PATH" required
              value={systemPath} onChange={e => setSystemPath(e.target.value)} className={systemPath === SYSTEM_PATH ? styles.singleInput : styles.inputChange} />
          </div>
          <div>
            <label htmlFor="category">「共通」、「Python」のようなカテゴリ</label>
            <input id="category" type="text" name="category" placeholder="CATEGORY" required
              value={category} onChange={e => setCategory(e.target.value)} className={category === CATEGORY ? styles.singleInput : styles.inputChange} />
          </div>
          <div>
            <label htmlFor="filename">page.mdのようなファイル名</label>
            <input id="filename" type="text" name="filename" placeholder="FILENAME" required
              value={filename} onChange={e => setFileName(e.target.value)} className={filename === FILENAME ? styles.singleInput : styles.inputChange} />
          </div>
          <div>
            <label htmlFor="title">ページのタイトル</label>
            <input id="title" type="text" name="title" placeholder="TITLE" required
              value={title} onChange={e => setTitle(e.target.value)} className={title === TITLE ? styles.singleInput : styles.inputChange} />
          </div>
          <div>
            <label htmlFor="desc">ページのdescription（80~120文字目安）</label>
            <textarea id="desc" name="description" placeholder="DESCRIPTION" required
              value={description} onChange={e => {
                setDescription(e.target.value);
                setCount(e.target.value.length);
              }} className={description === DESCRIPTION ? styles.singleInput + " " + styles.largeInput : styles.inputChange + " " + styles.largeInput} />
            <span className={styles.count}>文字数:{count}</span>
          </div>
          <div>
            <label htmlFor="author">作者名</label>
            <input id="author" type="text" name="author" placeholder="AUTHOR" required
              value={author} onChange={e => setAuthor(e.target.value)} className={author === AUTHOR ? styles.singleInput : styles.inputChange} />
          </div>
          <div>
            <label htmlFor="published">初回投稿日（入力不可）</label>
            <input id="published" type="text" name="published" placeholder="PUBLISHED" value={published} onChange={e => setPublished(e.target.value)} className={published === PUBLISHED ? styles.singleInput : styles.inputChange} disabled />
          </div>
          <div>
            <label htmlFor="updated">更新日（「YYYY/MM/DD」, 「YYYY/MM/DD HH:MM:SS」）</label>
            <input id="updated" type="text" name="updated" placeholder="UPDATED" value={updated} onChange={e => setUpdated(e.target.value)} className={updated === UPDATED ? styles.singleInput : styles.inputChange} />
          </div>
          <div>
            <label htmlFor="prev">前のページ（任意）</label>
            <input id="prev" type="text" name="prev" placeholder="PREV"
              value={prev} onChange={e => setPrev(e.target.value)} className={prev === PREV ? styles.singleInput : styles.inputChange} />
          </div>
        </div>
        <div className={styles.fill}>
          <input type="submit" value="update" className={styles.singleInput + " " + styles.wide + " " + styles.fancy} />
        </div>
      </form>
    </section >
  )
}
