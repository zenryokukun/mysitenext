"use client";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { Heart } from "../../component/Icons";
import styles from "./Like.module.css";

// グローバル変数はcomponentがunmount→再mountしても値が残る。
// ロード時に読み込まれてそのままのもよう。mountはあくまでReactのComponentのみが対象か。
// let notClicked = true;

export default function Like() {

  // 初回クリック判定。初回クリック時にDBを更新するために利用。
  // renderingとは関係が無いので、useRefにした。トップレベルのコメントの通り、
  // global変数だとunmountしても値を保持し続けるため、useRefにした。
  // useRefなら、再レンダリング時に値を保持をし続けてくれるし、unmount->再マウントで初期化してくれる。
  const notClicked = useRef<boolean>(true);

  // クリックのオン・オフを切り替える。適用するCSSの判定に利用。思えば直接レンダリングに関係しない。。。 
  const [isClicked, setIsClicked] = useState(false);

  // ハイライト判定に利用。
  const [isHighLight, setHighLight] = useState(false);

  // パス名。DBの更新条件に必要。
  const pathname = usePathname();

  // mousehoverをcssでなくjsで再現
  const enter = (e: React.MouseEvent<HTMLDivElement>) => setHighLight(true);
  const leave = (e: React.MouseEvent<HTMLDivElement>) => setHighLight(false);

  // click時の動作。CSS切替用にisClickedを更新。併せて初回click時にはDBを更新。
  const click = (e: React.MouseEvent<HTMLDivElement>) => {
    // 初回クリック、かつ未クリック状態ならDBを更新。
    // クリック時に本関数が実行されるため、「未クリック状態でクリックした」場合に更新する必要がある。
    if (notClicked.current && !isClicked) {
      updateDB();
    }
    // クリック状態で維持。
    notClicked.current = false;
    // clickステータスを更新。
    setIsClicked(() => !isClicked);
    // 既にハイライトされている場合、オフにする。
    // "オフにするためのクリック"であっても、enter処理が走ってハイライトされた状態になるのを防ぐため。
    if (isHighLight) setHighLight(false);
  }

  const genColorStyle = () => {
    if (isClicked) {
      return styles.accent;
    }
    return isHighLight ? styles.accentOnHover : styles.primary;
  }

  const updateDB = () => {
    if (pathname == null) return;
    const dir = pathname.split("/").slice(-1)[0];
    const param = { dir };
    fetch("/api/post/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param),
    })
      .then(res => {
        if (res.status !== 200) {
          console.log(res.statusText);
        }
      })
  };

  // useEffect(() => {

  //   if (pathname === null) return;
  //   const dir = pathname.split("/").slice(-1)[0];
  //   const param = { dir }
  //   fetch("/api/post/like", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(param),
  //   })
  //     .then(res => {
  //       console.log(res.status);
  //       return res.json();
  //     })
  //     .then(data => console.log(data.msg));

  // }, [pathname])


  return (
    <div className={styles.likeWrapper}>
      <div className={`${styles.thanks} ${genColorStyle()}`}>
        {isClicked ? '"いいね"ありがとうございます！！' : '最後までありがとうございます。"いいね"も下さい。'}
      </div>
      <div className={styles.iconWrapper} onMouseEnter={enter} onMouseLeave={leave} onClick={click}>
        <Heart width="32px" className={`${styles.like} ${genColorStyle()}`} />
      </div>
    </div>
  );
}