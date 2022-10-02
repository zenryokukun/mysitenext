import { getComments } from "../lib/db/func";
import Modal from "../component/Modal";
import MyHead from "../component/MyHead";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import { MODE } from "../component/constants";
import styles from "../styles/Board.module.css";
import React, { useState } from "react";
import Loader from "../component/Loader"

interface CommentProp {
  name: string,
  msg: string,
  posted?: string,
}

const ENDPOINT_LIST = "/api/board/getlist"; //コメントの一覧を取得するAPI
const ENDPOINT_INSERT = "api/board/comment" // コメント挿入するAPI

export default function Board({ comments }: { comments: CommentProp[] }) {

  const [isModal, setModal] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const [commentState, setComment] = useState(comments);

  // post commentボタン押下時、モーダルを開く
  const showModal = (e: React.MouseEvent<HTMLDivElement>) => setModal(true);
  // モーダルのcloseボタンを押下時、モーダルを閉じる。Modalコンポーネントで実行する。
  const hideModal = () => setModal(false);
  // コメントが新たにポストされたらコメント表示を一新する。Modal コンポーネントで実行する。
  const reload = () => {
    fetch(ENDPOINT_LIST).then(data => data.json()).then(newComments => setComment(newComments));
  };
  // モーダルのpostボタン押下時処理。Modal コンポーネントで呼ぶ。
  const postComment = (body: CommentProp) => {
    setLoader(true); // Loader表示
    fetch(ENDPOINT_INSERT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .catch(err => alert(err))
      .finally(() => {
        setModal(false);  // Modal非表示
        setLoader(false); // Loader非表示
        reload();         // コメント再表示
      });
  };


  return (
    <>
      <MyHead title="掲示板"></MyHead>
      {isLoading && <Loader text="ナウ、アップローディン..."></Loader>}
      <Menu iniMode={MODE.BOARD}></Menu>
      <main className={styles.main}>
        {commentState.map((comment, i) => {
          const { name, msg, posted } = comment;
          return <Comment key={i} name={name} msg={msg} posted={posted}></Comment>
        })}
        <div className={styles.commentButton} onClick={showModal}>Post Comment</div>
      </main>
      {isModal && <Modal post={postComment} close={hideModal}></Modal>}
      <Footer></Footer>
    </>
  );
}

function Comment({ name, msg, posted }: CommentProp) {
  return (
    <div className={styles.commentWrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.msg}>{msg}</div>
      <div className={styles.when}>{posted}</div>
    </div>
  );
}

export async function getServerSideProps() {
  const data = await getComments(20);
  const comments = JSON.parse(JSON.stringify(data));
  return {
    props: { comments }
  };
}