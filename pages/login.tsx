import MyHead from "../component/MyHead";
import styles from "../styles/Login.module.css";
import React, { useState } from "react";

export default function Page() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <MyHead title="login page"></MyHead>
      <div className={styles.container}>
        <form className={styles.form} action="/api/login" method="POST">
          <div className={styles.itemWrapper}>
            <h2 className={styles.label}>USER ID</h2>
            <label htmlFor="user-id"></label>
            <input className={styles.inputText} type="text" name="user" onChange={e => setUser(e.target.value)} />
          </div>
          <div className={styles.itemWrapper}>
            <h2 className={styles.label}>PASSWORD</h2>
            <label htmlFor="password"></label>
            <input className={styles.inputText} type="text" name="password" onChange={e => setPassword(e.target.value)} />
          </div>
          <div className={styles.itemWrapper}>
            <input className={styles.submit} type="submit" value="SUBMIT" />
          </div>
        </form>
      </div>
    </>
  );
}
