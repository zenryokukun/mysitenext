"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import styles from "./Like.module.css";

export default function Like() {

  const [isClicked, setIsClicked] = useState(false);
  const [isHighLight, setHighLight] = useState(false);
  const pathname = usePathname();
  // mousehoverをcssでなくjsで再現
  const enter = (e: React.MouseEvent<HTMLDivElement>) => setHighLight(true);
  const leave = (e: React.MouseEvent<HTMLDivElement>) => setHighLight(false);
  const click = (e: React.MouseEvent<HTMLDivElement>) => setIsClicked(() => !isClicked)

  const genColorStyle = () => {
    if (isClicked) {
      return styles.accent;
    }
    return isHighLight ? styles.accentOnHover : styles.primary;
  }

  useEffect(() => {
    // ページを離れたとき？

    if (!isClicked) return;
    if (pathname === null) return;
    const dir = pathname.split("/").slice(-1)[0];
    const param = { dir }
    fetch("/api/post/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(param),
    })
      .then(raw => raw.text())
      .then(text => console.log(text))

  }, [pathname])

  return (
    <div className={styles.likeWrapper}>
      <div className={`${styles.thanks} ${genColorStyle()}`}>
        {isClicked ? '"いいね"ありがとうございます！！' : '最後までありがとうございます。"いいね"も下さい。'}
      </div>
      <div className={styles.iconWrapper} onMouseEnter={enter} onMouseLeave={leave} onClick={click}>
        {/* <i className={`fa-solid fa-heart fa-2x ${styles.like} ${color}`}></i> */}
        <FontAwesomeIcon icon={faHeart} size="2x" className={`${styles.like} ${genColorStyle()}`} />
      </div>
    </div>
  );
}