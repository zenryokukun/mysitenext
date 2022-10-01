import React from "react";
import { useState } from "react";
import styles from "../styles/Modal.module.css";

interface CommentProp {
  name: string,
  msg: string,
  posted?: string,
}


const ENDPOINT = "/api/board/comment"

interface Prop {
  hideModal: (e: React.MouseEvent<HTMLDivElement> | null) => void,
  showLoader: () => void,
  hideLoader: () => void,
  reload: () => void,
}


export default function Modal({ hideModal, showLoader, hideLoader, reload }: Prop) {

  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const submit = () => {
    // post押下でLoader表示
    showLoader();
    // コメント挿入
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirect: "follow",
      body: JSON.stringify({ name: name, msg: msg }),
    })
      .catch(err => alert(err))
      .finally(() => {
        hideModal(null);
        hideLoader();
        reload();
      });
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
            <div tabIndex={2} className={styles.close} onClick={hideModal}>X Close</div>
          </div>
        </div>
      </div >
    </>
  );
}