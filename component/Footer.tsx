import React from "react";
import { ICON } from "./constants";
import styles from "./Footer.module.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-regular-svg-icons"
import { faTwitter, faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons"
import { faBuildingShield } from "@fortawesome/free-solid-svg-icons"

export default function Footer() {
  let contStyle = styles.container;
  const year = new Date().getFullYear();
  return (
    <div>
      <div className={contStyle}>
        <div className={`${styles.message} ${styles.large}`}>
          <div className={styles.messageItem}>全力君より、愛を込めて。</div>
          <div className={styles.messageItem}>
            {/* <i className="fa-regular fa-copyright"></i> */}
            <FontAwesomeIcon icon={faCopyright} />
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
      <div className={`${styles.light} ${styles.large}`}>Feel free to follow me.</div>
      <div>
        <a className={styles.iconLink} aria-label={ICON.TWITTER.LABEL} href={ICON.TWITTER.LINK}>
          <FontAwesomeIcon icon={faTwitter} size="2x" />
        </a>
        <a className={styles.iconLink} aria-label={ICON.INSTAGRAM.LABEL} href={ICON.INSTAGRAM.LINK}>
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </a>
        <a className={styles.iconLink} aria-label={ICON.GITHUB.LABEL} href={ICON.GITHUB.LINK}>
          <FontAwesomeIcon icon={faGithub} size="2x" />
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
          {/* <span className={`${styles.sidePadding} fa-solid fa-building-shield`}></span> */}
          <FontAwesomeIcon icon={faBuildingShield} className={styles.sidePadding} width={20} height={18} />
          <span>Site Policy</span>
        </Link>
      </div>
    </div>
  );
}