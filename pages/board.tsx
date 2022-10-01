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

async function getCommentList() {
  const data = await fetch(ENDPOINT_LIST).then(v => console.log(v));
}

export default function Board({ comments }: { comments: CommentProp[] }) {

  const [isModal, setModal] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const [commentState, setComment] = useState(comments);

  // post commentボタン押下時、モーダルを開く
  const showModal = (e: React.MouseEvent<HTMLDivElement>) => setModal(true);
  // モーダルのcloseボタンを押下時、モーダルを閉じる。Modalコンポーネントで実行する。
  const hideModal = (e: React.MouseEvent<HTMLDivElement> | null) => setModal(false);
  // モーダルのpostボタン押下時、loaderを表示させる。Modalコンポーネントで実行する。
  const showLoader = () => setLoader(true);
  // Loadingが終わったらLoaderを非表示にする。
  const hideLoader = () => setLoader(false);
  // コメントが新たにポストされたらコメント表示を一新する。Modal コンポーネントで実行する。
  const reload = () => {
    fetch(ENDPOINT_LIST).then(data => data.json()).then(newComments => setComment(newComments));
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
      {isModal && <Modal hideModal={hideModal} showLoader={showLoader} hideLoader={hideLoader} reload={reload}></Modal>}
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