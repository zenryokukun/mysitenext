
import { useState } from "react";
import Link from "next/link.js";
import { MODE } from "./constants.js";
import styles from "../styles/Menu.module.css";

interface MenuProp {
  iniMode: number,
}

interface ItemProp {
  text: string,
  id: number,
  cn: string,
  href: string,
  select: () => void,
}

interface HamProp {
  tap: () => void,
}

export default function Menu({ iniMode }: MenuProp) {

  const [isSpread, setSpread] = useState(false);

  // MenuItemをクリックした時のイベント関数
  const select = () => {
    setSpread(false);
    // setMode(mode);
    // setSelected(mode);
  };
  // MenuHamをクリックした時のイベント関数
  const tap = () => setSpread(isSpread => !isSpread);
  // 表示データと対応する定数
  const texts = ["home", "about", "blog", "production", "board", "updates"];
  const ids = [MODE.HOME, MODE.ABOUT, MODE.BLOG, MODE.PRODUCTION, MODE.BOARD, MODE.UPDATES];

  const showul = isSpread ? styles.show : styles.hide;
  return (
    <div className={styles.container}>
      <div className={styles.selected}>{texts[iniMode]}</div>
      <header>
        <nav>
          <ol className={`${styles.myol} ${showul}`}>
            {genItems(texts, ids, iniMode, select, isSpread)}
          </ol>
        </nav>
      </header>
      <MenuHam tap={tap}></MenuHam>
    </div>
  );
}


// MenuItemの一覧を取得するhelper関数
// texts    :メニューに表示する文字列リスト
// ids      :textに対応する定数のリスト
// mode :選択されているメニューの定数
// fn       :メニュークリック時に動作する関数
function genItems(
  texts: string[], ids: number[], mode: number,
  fn: () => void,
  isSpread: boolean
): JSX.Element[] {
  const jsxElems: JSX.Element[] = [];
  texts.forEach((txt: string, i: number) => {
    const id = ids[i];

    let cn = styles.item;
    if (id == mode) {
      //　選択されたメニューにスタイル追加
      cn += " " + styles.active;
    }
    if (isSpread && id !== mode) {
      // hamがタップされた場合のスタイル追加
      cn += " " + styles.spread

    }

    let href = "/"
    // homeはlocalhost:3000/ とルート扱いなので設定しない。
    if (id !== MODE.HOME) {
      href += txt;
    }
    const menu = <MenuItem text={txt} id={id} cn={cn} select={fn} key={id} href={href}></MenuItem>
    jsxElems.push(menu);
  });
  return jsxElems;
}

function MenuItem({ text, id, cn, select, href }: ItemProp) {
  return (
    <Link href={href}>
      <li className={cn} onClick={() => select()}>
        <a className={styles.link}>{text}</a>
      </li>
    </Link>
  );
}

function MenuHam({ tap }: HamProp) {
  return (
    <a className={styles.ham} onClick={tap}>
      <i className="fa fa-bars"></i>
    </a>
  );
}
