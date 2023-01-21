import React from "react";
import { ICON } from "./constants";
import styles from "./Footer.module.css";
import IconLink from "./IconLink";


export default function Footer() {
  let contStyle = styles.container;
  return (
    <div>
      <div className={contStyle}>
        <div className={`${styles.message} ${styles.large}`}>
          <div className={styles.messageItem}>全力君より、愛を込めて。</div>
          <div className={styles.messageItem}><i className="fa-regular fa-copyright"></i>
            2022 全力君</div>
        </div>
        <div className={styles.content}>
          <AboutFooter></AboutFooter>
          <IconFooter></IconFooter>
          <MapFooter></MapFooter>
        </div>
      </div>
    </div>
  );
}

function AboutFooter() {
  return (
    <div className={styles.flexOne}>
      <div className={`${styles.light} ${styles.large}`}>
        ABOUT
      </div>
      <div className={`${styles.light} ${styles.small}`}>
        <div>削り削って研ぎ澄ませ、最先端の感性を。</div>
        <div>そしてLANケーブルに、注ぎ込め！</div>
      </div>
    </div >
  );
}

function IconFooter() {
  return (
    <div className={styles.flexOne}>
      <div className={`${styles.light} ${styles.large}`}>Feel free to follow me.</div>
      <div className={`${styles.iconContainer} ${styles.topPadding}`}>
        <IconLink a={styles.noDecoration}
          fa={ICON.TWITTER.STYLE}
          href={ICON.TWITTER.LINK} />

        <IconLink a={styles.noDecoration}
          fa={ICON.INSTAGRAM.STYLE}
          href={ICON.INSTAGRAM.LINK} />

        <IconLink a={styles.noDecoration}
          fa={ICON.GITHUB.STYLE}
          href={ICON.GITHUB.LINK} />
      </div>
    </div>
  );
}

function MapFooter() {
  return (
    <div className={`${styles.light} ${styles.flexOne}`}>
      <div className={`${styles.underline} ${styles.large}`}>
        {/* <IconLink a={`${styles.noDecoration} ${styles.sidePadding}`}
          fa={ICON.MAP.STYLE}
          href={ICON.MAP.LINK} /> */}

        <a className={styles.noDecoration} href="/about/policy">
          <span className={`${styles.sidePadding} fa-solid fa-building-shield`}></span>
          <span>Site Policy</span>
        </a>
      </div>
      {/* <div className={`${styles.small} ${styles.topPadding}`}>The Greater Metropolitan Tokyo,JP.</div> */}
    </div>
  );
}