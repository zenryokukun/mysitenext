import { useEffect } from "react";
import style from "./SideBar.module.css";

export default function SideBar() {

  useEffect(() => {
    // twitterタイムラインのウィジェットのscriptタグを読み取る。
    const js = document.createElement("script");
    js.setAttribute("src", "https://platform.twitter.com/widgets.js");
    document.body.appendChild(js);
    // この行はよく分からないがtwitter apiのドキュメントにあったので入れた。
    (globalThis as any).twttr?.widgets?.load();
  }, []);

  return (
    <aside className={style.sideBarContainer}>
      <Author />
      <TwitterTL />
    </aside >
  );
}

function Author() {
  return (
    <div className={`${style.content} ${style.contentAuthor}`}>
      <div className={style.itemRow}>
        <div className={style.field}>
          <div className={style.iconWrapper}>
            <i className="fa-solid fa-person"></i>
          </div>
          <div className={style.fieldText}>Author</div>
        </div>
        <div >全力君</div>
      </div>
      <div className={style.itemRow}>
        <div className={style.field}>
          <div className={style.iconWrapper}>
            <i className="fa-regular fa-clock"></i>
          </div>
          <div className={style.fieldText}>Posted</div>
        </div>
        <div>2022/12/24</div>
      </div>
      <div className={style.itemRow}>
        <div className={style.field}>
          <div className={style.iconWrapper}>
            <i className="fa-brands fa-twitter"></i>
          </div>
          <div className={style.fieldText}>Contact</div>
        </div>
        <div><a href="https://twitter.com/zenryoku_kun0">twitter</a></div>
      </div>
      <div className={style.itemColumn}>
        <div className={style.field}>
          <div className={style.iconWrapper}>
            <i className="fa-solid fa-address-card"></i>
          </div>
          <div className={style.fieldText}>紹介</div>
        </div>
        <div className={style.itemColumnText}>東京都在住の30代。金融業界に勤める。人類愛に、目覚めたい。</div>
      </div>
    </div>
  );
}

function TwitterTL() {
  return (
    <div className={`${style.content} ${style.contentTweets}`}>
      <a className="twitter-timeline" data-width="270" data-height="700" data-theme="light" href="https://twitter.com/zenryoku_kun0?ref_src=twsrc%5Etfw">Tweets by zenryoku_kun0</a>
    </div>
  );
}