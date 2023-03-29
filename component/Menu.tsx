
import { useState } from "react";
import Link from "next/link.js";
import { MODE } from "./constants.js";
import styles from "./Menu.module.css";

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

  // mobileのときの、メニューリストの展開判定に使う
  const [isSpread, setSpread] = useState(false);

  // 表示データと対応する定数
  const texts = ["home", "about", "blog", "production", "board", "updates"];
  const ids = [MODE.HOME, MODE.ABOUT, MODE.BLOG, MODE.PRODUCTION, MODE.BOARD, MODE.UPDATES];

  // MenuItemをクリックした時のイベント関数
  const select = () => { setSpread(false); };

  // MenuHamをクリックした時のイベント関数。
  const tap = () => setSpread(isSpread => !isSpread);

  // mobileのときの、メニューリストの展開状態に応じたスタイルをセット
  const showul = isSpread ? styles.show : styles.hide;

  // 現在のメニューのテキスト
  const currentText = texts[iniMode]

  // 現在メニューのルートURL。home時はルートのため"/"のみ。
  // /blog → /post/blognameのような変則ルートや、/about → /about/policyのように階層が出来ているページでは、
  // 滞在モードとURLは必ずしも一致しない。
  // 滞在モードと同じメニューをクリックした時に、そのモードのルートページに遷移させたいので、
  // 滞在モードのルートページのURLを保持。(例：/post/blogname -> /blog, /about/policy -> /about)
  const href = iniMode !== MODE.HOME ? "/" + texts[iniMode] : "/"

  return (
    <div className={styles.container}>
      {/* 
       * mobile判定はmedia query で600px以下。
       * MenuHamコンポーネントはmobileのみ表示。
       * [.selected]              -- mobileのみ表示 
       * [showul(.hide,or .show)] -- mobileの時は基本非表示。tapしてspreadした状態の時は表示。
       *                          -- mobileでないときは表示。
       */}
      <div className={styles.selected}>
        <Link href={href} className={styles.selectedLink}>{currentText}</Link>
      </div>
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
      // メニュー展開状態。モバイルのみ。
      // id !== modeは、現在いるmodeを展開させない（.selectedで表示中のため）ために必要。
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
    <Link href={href} className={styles.link}>
      <li className={cn} onClick={() => select()}>
        {text}
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
