"use client"
import Link from "next/link";
import { useState } from "react";
import { Bar } from "./Icons";
import { MODE } from "./constants";
import styles from "./Navigation.module.css";

interface NavigationProp {
  iniMode: number;
}

export default function Navigation({
  iniMode
}: NavigationProp) {

  // [mobileのみ] ham(3点リーダ)がタップされたかを制御。
  // undefined -> 初期状態、true -> tapされた状態 false -> タップ状態を解除した状態
  const [isTapped, setIsTapped] = useState<boolean>(false);

  // [moibleのみ]3点リーダをクリックした時にanimation用CSSを設定する関数
  const tap = () => setIsTapped(!isTapped);

  // [mobileのみ] 3点リーダ：タップ時のアニメーション用のCSSを追加
  const hamCSS = isTapped === true ? `${styles.ham} ${styles.rotateForward}` : styles.ham;
  // [mobileのみ] アコーディオンメニュー：タップ時のアニメーション用のCSSを追加
  const menuCSS = isTapped === true ? `${styles.grid} ${styles.accordion}` : styles.grid;

  const texts = ["home", "about", "blog", "production", "board", "updates", "tutorial"];
  const currentPath = generatePath(iniMode, texts[iniMode]);

  return (
    <nav className={styles.container}>
      <div className={styles.mobileBar}>
        <Link href={currentPath} className={styles.link}>
          {texts[iniMode]}
        </Link>
        <div className={styles.hamWrapper} onClick={tap}>
          <Bar width="17px" className={hamCSS} />
        </div>
      </div>
      <div className={styles.menuWrapper} >
        <div className={menuCSS}>
          <ul className={styles.listWrapper}>
            {texts.map((name, i) => {
              let itemStyle = styles.listItem;
              if (i === iniMode) {
                // デフォルトで選択されたitemは色を付ける
                // mobile時はCSSで非表示になる。
                itemStyle += " " + styles.active;
              }
              return (
                <Item className={itemStyle} name={name} mode={i} key={i} />
              )
            })}
          </ul>
        </div>

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

