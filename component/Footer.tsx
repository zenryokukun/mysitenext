import React from "react";
import { ICON } from "./constants";
import styles from "./Footer.module.css";
import Link from "next/link";
import { CopyRightRegular, Twitter, Instagram, GitHub, BuildingShield } from "./Icons";

export default function Footer() {
  let contStyle = styles.container;
  const year = new Date().getFullYear();
  return (
    <div>
      <div className={contStyle}>
        <div className={`${styles.message} ${styles.large}`}>
          <div className={styles.messageItem}>全力君より、愛を込めて。</div>
          <div className={`${styles.messageItem} ${styles.copyRightMessage}`}>
            <CopyRightRegular className={styles.copyRightIcon} width="17.6px" height="17.6px" />
            {` ${year} 全力君`}
          </div>
        </div>
        <div className={styles.content}>
          <AboutFooter></AboutFooter>
          <IconFooter></IconFooter>
          <SitePolicy></SitePolicy>
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
      <div className={`${styles.light} ${styles.large} ${styles.topMargin}`}>Feel free to follow me.</div>
      <div className={styles.iconRow}>
        <a className={styles.iconLink} aria-label={ICON.TWITTER.LABEL} href={ICON.TWITTER.LINK}>
          <Twitter width="32px" height="32px" />
        </a>
        <a className={styles.iconLink} aria-label={ICON.INSTAGRAM.LABEL} href={ICON.INSTAGRAM.LINK}>
          <Instagram width="32px" height="36.5px" />
        </a>
        <a className={styles.iconLink} aria-label={ICON.GITHUB.LABEL} href={ICON.GITHUB.LINK}>
          <GitHub width="32px" height="31px" />
        </a>
      </div>
    </div>
  );
}

function SitePolicy() {
  return (
    <div className={`${styles.light} ${styles.flexOne}`}>
      <div className={`${styles.underline} ${styles.large}`}>
        <Link className={styles.iconLink} href="/about/policy">
          <BuildingShield className={styles.sideMargin} width={"22px"} height={"20px"} />
          <span>Site Policy</span>
        </Link>
      </div>
    </div>
  );
}