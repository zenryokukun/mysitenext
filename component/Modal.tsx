import React from "react";
import { useState } from "react";
import styles from "../styles/Modal.module.css";

interface CommentProp {
  name: string,
  msg: string,
  posted?: string,
}

interface ModalProp {
  post: (body: CommentProp) => void,
  close: () => void,
}

export default function Modal({ post, close }: ModalProp) {

  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const submit = () => {
    if (msg.length === 0 || name.length === 0) {
      alert("Nameとコメントは入力必須です。")
      return;
    }
    post({ name, msg })
  };


  return (
    <>
      <div className={styles.modal}>
        <div className={styles.wrapper}>
          <div className={styles.name}>
            <div className={styles.name_label}>Name</div>
            <input
              maxLength={30}
              className={styles.name_text} type="text"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>
          <div className={styles.comment}>
            <div className={styles.comment_label}>Comment</div>
            <textarea
              maxLength={500}
              className={styles.comment_text}
              value={msg} onChange={e => setMsg(e.target.value)}
            >
            </textarea>
          </div>
          <div className={styles.button}>
            <div tabIndex={1} className={styles.post} onClick={submit}>Post</div>
            <div tabIndex={2} className={styles.close} onClick={close}>X Close</div>
          </div>
        </div>
      </div >
    </>
  );
}