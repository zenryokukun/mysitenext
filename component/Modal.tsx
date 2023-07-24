import React from "react";
import DOMPurify from "dompurify";
import { useState } from "react";
import styles from "./Modal.module.css";
import type { PostBody } from "../app/board/Board";

interface ModalProp {
  post: (body: PostBody) => void;
  close: () => void;
  // スレッドのID。新規の場合はnull
  parentSeq: number | null;
}

export default function Modal({ post, close, parentSeq }: ModalProp) {

  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  // topic
  const [topic, setTopic] = useState("");

  const submit = () => {
    if (msg.length === 0 || name.length === 0) {
      alert("Nameとコメントは入力必須です。")
      return;
    }
    if (!parentSeq && topic.length === 0) {
      alert("topicは入力必須です");
      return;
    }
    // sanitize input;
    const cleanName = DOMPurify.sanitize(name);
    const cleanMsg = DOMPurify.sanitize(msg);

    let cleanTopic = topic;
    if (topic.length !== 0) {
      cleanTopic = DOMPurify.sanitize(topic);
    }
    // post
    console.log(`post parentSeq:${parentSeq}`)
    post({
      name: cleanName,
      msg: cleanMsg,
      topic: cleanTopic,
      parentSeq
    })
  };


  return (
    <>
      <div className={styles.modal}>
        <div className={styles.wrapper}>
          {!parentSeq &&
            <div className={styles.topic + " " + styles.first}>
              <div className={styles.topic_label}>Topic</div>
              <input type="text"
                className={styles.topic_text}
                maxLength={200}
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
          }
          <div className={!parentSeq ? styles.name : styles.name + " " + styles.first}>
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