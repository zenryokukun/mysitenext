/**
 * 要望を入力するform。入力内容はlinenotifyで連携。
 */

"use client";
import Image from "next/image";
import { useState } from "react";
import DOMPurify from "dompurify";
import styles from "./Request.module.css";
import type { DetailedHTMLProps, TextareaHTMLAttributes } from "react";

/**
 * React版のtextareaの属性を受け取る。valueはReact(JSX?)専用属性なので。
 * textareaと、残りの文字数を表示するdivも含む。
 **/
export default function Request(
  props: DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
) {

  // 初期の値と最大入力値をpropsから取得
  const { value, maxLength } = props;
  // 入力最大値は指定がなかったら500にしておく。
  let limit = maxLength || 500;

  // controll inputにするため。textareaの入力値。
  const [userInput, setUserInput] = useState(value);
  // 入力残り文字数用
  const [charsLeft, setCharsLeft] = useState(limit);
  // 送信フラグ。連続送信防止用。
  const [posted, setPosted] = useState(false);
  // 送信中状態。loader表示用
  const [loading, setLoading] = useState(false);

  // 入力値を変えた時、userInputと残り文字数を更新
  const onchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentInput = e.target.value
    setUserInput(currentInput);
    setCharsLeft(limit - currentInput.length);
  }

  // submit処理
  const onsubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // デフォルトのsubmitを無効化。
    e.preventDefault();
    // 既に送信済ならエラー
    if (posted) {
      alert("送信済です");
      return;
    }
    // 入力値が文字列でなかったらエラー 
    if (typeof userInput !== "string") {
      alert("入力内容が不正です");
      return;
    }
    // 入力値が空文字ならエラー
    if (userInput.length === 0) {
      alert("何か入力してください")
      return;
    }

    // エラーなし。サニタイズして送信
    const cleanInput = DOMPurify.sanitize(userInput);

    try {
      // loaderを表示し、データ送信する
      setLoading(true);
      const res = await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg: cleanInput }),
      });

      // レスポンスがok以外ならエラー
      if (!res.ok) {
        throw new Error(res.statusText);
      }

      // post成功。postフラグを設定し、
      // 専用のplaceholderを表示させるため、入力内容をクリアする。
      // loaderも消す
      setPosted(true);
      setUserInput("");
      setLoading(false);

    } catch (err) {
      setLoading(false);
      alert(err);
    }
  }

  return (
    <form className={styles.wrapper} onSubmit={onsubmit}>
      <textarea className={styles.ta}
        {...props}
        name="msg"
        disabled={posted ? true : false}
        placeholder={posted ? "送信済みです。" : props.placeholder}
        onChange={onchange}
        value={userInput}
      />
      <div className={styles.left}>残り文字数：{charsLeft}</div>
      <button
        className={styles.submit}
        type="submit"
        disabled={posted ? true : false}
      >SUBMIT
      </button>
      {loading &&
        <div className={styles.loaderWrapper}>
          <Image
            className={styles.loader}
            src="/loader.gif" alt="loader" width={475} height={480}
          />
        </div>
      }
    </form>
  );
}