"use client";
import { useState } from "react"
import styles from "./Toggle.module.css"

export default function Toggle() {
  const [toggle, setToggle] = useState(false);
  let barStyle = styles.bar;
  let ballStyle = styles.ball;
  if (toggle) {
    barStyle += " " + styles.barOn;
    ballStyle += " " + styles.ballOn;
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.text}>クリックしてみてね！</div>
      <div className={barStyle} onClick={() => setToggle(!toggle)}>
        <div className={ballStyle}></div>
      </div>
    </div>
  )
}