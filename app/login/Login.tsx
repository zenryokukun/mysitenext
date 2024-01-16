"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "../../component/Navigation";
import { MODE } from "../../component/constants";
import styles from "../../styles/Login.module.css";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  /**
   * routerでNextResponse.redirectしても、ページ遷移してくれないので、urlを返す方式に変更。
   * そのため、formのPOSTをブラウザ規定でなく自作関数で実装。
   */
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, password }),
    });

    if (res.status !== 200) {
      alert(`Status:${res.status}, Message:${res.statusText}`);
      return;
    }

    const { url } = await res.json();
    router.push(url);

  };

  return (
    <>
      <Navigation iniMode={MODE.HOME} />
      <div className={styles.container}>
        <form className={styles.form} method="POST" onSubmit={submit}>
          <div className={styles.itemWrapper}>
            <h2 className={styles.label}>USER ID</h2>
            <label htmlFor="user-id"></label>
            <input id="user-id" className={styles.inputText} type="text" name="user" onChange={e => setUser(e.target.value)} />
          </div>
          <div className={styles.itemWrapper}>
            <h2 className={styles.label}>PASSWORD</h2>
            <label htmlFor="user-pwd"></label>
            <input id="user-pwd" className={styles.inputText} type="text" name="password" onChange={e => setPassword(e.target.value)} />
          </div>
          <div className={styles.itemWrapper}>
            <input className={styles.submit} type="submit" value="SUBMIT" />
          </div>
        </form>
      </div>
    </>
  );
}