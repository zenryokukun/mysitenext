/**
 * 画面上部に表示するナビゲーションバー。従来のMenu.tsxの改良版。
 * mobile時のアニメーションを追加している
 * - ３点リーダをクリック時、リーダの回転のアニメーションを追加
 * - menuを閉じるアニメーションを追加
 */

"use client";
import { useState } from "react";
import Link from "next/link";
import { Bar } from "./Icons";
import { MODE } from "./constants";
import styles from "./Navigation.module.css";

interface NavigationProp {
  iniMode: number;
}

export default function Navigation({ iniMode }: NavigationProp) {

  // [mobileのみ] ham(3点リーダ)がタップされたかを制御。
  // undefined -> 初期状態、true -> tapされた状態 false -> タップ状態を解除した状態
  const [isTapped, setIsTapped] = useState<boolean>();

  // [moibleのみ]3点リーダをクリックした時にanimation用CSSを設定する関数
  const tap = () => setIsTapped(!isTapped);

  // [mobileのみ] CSS animationが終わった時に呼ぶ関数
  const animationEnd = () => {
    // タップ解除された状態なら、初期状態に戻す
    if (!isTapped) {
      setIsTapped(undefined);
      // setMenuCSS(`${styles.listWrapper} ${styles.hide}`);
    }
  }

  // isTappedに応じた、3点リーダとリストのメニュー用CSSを取得
  // hamCSSは、3点リーダのiconにつけること（hamのラッパーにはつけないこと）。
  // ラッパーを回転させると、縦横比の都合で横スクロールバーが出てしまうため。
  const { hamCSS, menuCSS } = generateCSS(isTapped);

  // MODE定数に対応したMODE名。indexがMODE定数と一致している必要ある（順番大事）。
  const texts = ["home", "about", "blog", "production", "board", "updates"];

  // 滞在モードのルートページのURLを保持。(例：/post/blogname -> /blog, /about/policy -> /about)
  const currentPath = generatePath(iniMode, texts[iniMode]);

  return (
    <nav className={styles.container}>
      <Link className={styles.mobileBar} href={currentPath}>
        {texts[iniMode]}
      </Link>
      <ol className={menuCSS} onAnimationEnd={animationEnd}>
        {texts.map((name, i) => {
          let itemStyle = styles.listItem;
          if (i === iniMode) {
            // [mobile以外]デフォルトで選択されたitemは色を付ける
            itemStyle += " " + styles.active;
          }
          return (
            <Item className={itemStyle} name={name} mode={i} key={i} />
          )
        })}
      </ol>
      <div className={styles.hamWrapper} onClick={tap}>
        <Bar width="17px" className={hamCSS} />
      </div>
    </nav>
  );
}

interface ItemProp {
  // MODEのコード
  mode: number;
  // mode名
  name: string;
  // className
  className: string;
}
export function Item({ name, mode, className }: ItemProp) {

  // 遷移先となるパス。HOMEはルート扱いなので、HOME時は"/"となる。
  // HOME以外は、"/"＋モード名（/blog, /production等）となる。
  const redirectPath = generatePath(mode, name);

  return (
    <li className={className}>
      <Link className={styles.link} href={redirectPath}>{name}</Link>
    </li>
  )
}


/**
 * 滞在モードのルートページのパスを返す関数。(例：/post/blogname -> /blog, /about/policy -> /about)
 * @param mode MODE定数
 * @param name MODE定数に対応したモード名
 */
function generatePath(mode: number, name: string) {
  // HOME時は"/"を返す
  if (mode === MODE.HOME) {
    return "/";
  }
  // HOME以外は"/モード名"を返す
  return "/" + name;
}


/**
 * 3点リーダの状態に応じて、3点リーダとmobileのメニュー用のCSSを生成する関数
 * 　isTapped: 
 *    undefined -> 初期状態。
 *    true -> 選択状態
 *    false -> 選択解除した状態
 * @param isTapped 3点リーダのクリック状態
 * @returns 
 */
function generateCSS(isTapped: undefined | boolean) {

  // 初期表示の場合
  if (isTapped === undefined) {
    return {
      hamCSS: "",
      menuCSS: `${styles.listWrapper} ${styles.hide}`
    };
  }

  // タップされた状態。mobileのメニューを展開する
  if (isTapped === true) {
    return {
      hamCSS: `${styles.rotateForward}`,
      menuCSS: `${styles.listWrapper}  ${styles.spreadMenu}`,
    }
  }

  // 再タップしてタップ状態を解除した状態。mobileのメニューを非表示にする
  if (isTapped === false) {
    return {
      hamCSS: `${styles.rotateBack}`,
      menuCSS: `${styles.listWrapper} ${styles.closeMenu}`,
    }
  }

  // いずれにも該当しない場合、初期状態と同じcssを返す。
  return {
    hamCSS: "",
    menuCSS: `${styles.listWrapper} ${styles.hide}`
  };
}