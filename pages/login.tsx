import MyHead from "../component/MyHead";
import styles from "../styles/Login.module.css";

export default function Page() {
  return (
    <>
      <MyHead title="login page"></MyHead>
      <div className={styles.container}>
        <form className={styles.form} action="/api/login" method="POST">
          <div className={styles.itemWrapper}>
            <h2 className={styles.label}>USER ID</h2>
            <label htmlFor="user-id"></label>
            <input className={styles.inputText} type="text" name="user" />
          </div>
          <div className={styles.itemWrapper}>
            <h2 className={styles.label}>PASSWORD</h2>
            <label htmlFor="password"></label>
            <input className={styles.inputText} type="text" name="password" />
          </div>
          <div className={styles.itemWrapper}>
            <input className={styles.submit} type="submit" value="SUBMIT" />
          </div>
        </form>
      </div>
    </>
  );
}
