import { useState, useEffect } from "react";

import styles from "./Like.module.css";

// like component
interface LikeProp {
  isClicked: boolean, // いいねがクリックされているか
  likeClick: () => void, // いいねをクリックした時の関数
}


export default function Like({ isClicked, likeClick }: LikeProp) {
  const [isHighLight, setHighLight] = useState(false);
  const [color, setColor] = useState(styles.primary);
  // mousehoverをcssでなくjsで再現
  const enter = (e: React.MouseEvent<HTMLDivElement>) => setHighLight(true);
  const leave = (e: React.MouseEvent<HTMLDivElement>) => setHighLight(false);
  const click = (e: React.MouseEvent<HTMLDivElement>) => likeClick();

  // mount時、unmount時、mousehover時に実行。iconの色反転に使う
  useEffect(() => {
    if (isClicked) {
      setColor(styles.accent);
    } else {
      let _color = styles.primary;
      _color = isHighLight ? styles.accentOnHover : styles.primary;
      setColor(_color);
    }
  }, [isClicked, isHighLight]);

  return (
    <div className={styles.likeWrapper}>
      <div className={`${styles.thanks} ${color}`}>
        {isClicked ? '"いいね"ありがとうございます！！' : '最後までありがとうございます。"いいね"も下さい。'}
      </div>
      <div className={styles.iconWrapper} onMouseEnter={enter} onMouseLeave={leave} onClick={click}>
        <i className={`fa-solid fa-heart fa-2x ${styles.like} ${color}`}></i>
      </div>
    </div>
  );
}