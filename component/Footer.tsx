import React from "react";
import { ICON } from "./constants";
import styles from "../styles/Footer.module.css";
import IconLink from "./IconLink";


export default function Footer() {
  let contStyle = styles.container;
  return (
    <div>
      <div className={contStyle}>
        <div className={`${styles.message} ${styles.large}`}>Brought to you by Zenryokukun, with love.</div>
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
        <div>ありとあらゆる集団からはじき出される不適合者。</div>
        <div>同じ境遇の人に、少しでも憩いの場を。</div>
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
        <IconLink a={`${styles.noDecoration} ${styles.sidePadding}`}
          fa={ICON.MAP.STYLE}
          href={ICON.MAP.LINK} />

        <span >Unemployed Inc.</span>
      </div>
      <div className={`${styles.small} ${styles.topPadding}`}>The Greater Metropolitan Tokyo,JP.</div>
    </div>
  );
}