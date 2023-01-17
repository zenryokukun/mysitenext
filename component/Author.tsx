/**
 * SideBarLayoutのSidePartに表示させる、作者情報等のComponent。
 * 追ってcssを多少カスタム出来るようにレイアウトから分離させた。
 * レイアウトから切り離したため、レスポンシブ対応発動時の幅を変更する場合は、
 * レイアウトとこのComponentのcssそれぞれ修正が必要になるので留意。
 */

import styles from "./Author.module.css";

interface AuthorP {
  name: string,
  postedDate?: string,
  containerStyle?: string,
}

export default function Author({ name, postedDate, containerStyle }: AuthorP) {
  return (
    <section className={containerStyle || styles.container}>
      <div className={`${styles.item} ${styles.itemRow}`}>
        <div className={styles.field}>
          <div className={styles.iconWrapper}>
            <i className="fa-solid fa-person"></i>
          </div>
          <div className={styles.fieldText}>Author</div>
        </div>
        <div>{name}</div>
      </div>
      {postedDate &&
        <div className={`${styles.item} ${styles.itemRow}`}>
          <div className={styles.field}>
            <div className={styles.iconWrapper}>
              <i className="fa-regular fa-clock"></i>
            </div>
            <div className={styles.fieldText}>Posted</div>
          </div>
          <div>{postedDate}</div>
        </div>
      }
      <div className={`${styles.item} ${styles.itemRow}`}>
        <div className={styles.field}>
          <div className={styles.iconWrapper}>
            <i className="fa-brands fa-twitter"></i>
          </div>
          <div className={styles.fieldText}>Contact</div>
        </div>
        <div><a href="https://twitter.com/zenryoku_kun0">twitter</a></div>
      </div>
      <div className={`${styles.item} ${styles.itemColumn}`}>
        <div className={styles.field}>
          <div className={styles.iconWrapper}>
            <i className="fa-solid fa-address-card"></i>
          </div>
          <div className={styles.fieldText}>紹介</div>
        </div>
        <div className={styles.itemColumnText}>東京都在住の30代。金融業界に勤める。人類愛に、目覚めたい。</div>
      </div>
    </section>
  );
}