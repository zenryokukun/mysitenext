"use client"
/**
 * page.tsxをclient componentにするとgetPropsが聞かない
 * （サーバ側で動くロジックのため。）
 * page.tsxはserver componentsのままにし、client部分を切り出した。
 * 
 */
import { useState } from "react"
import Modal from "../../component/Modal"
import Loader from "../../component/Loader"
import styles from "../../styles/Board.module.css"
import type { WithId, Document } from "mongodb"

interface Comment {
  name: string,
  msg: string,
  posted?: string,
}

type Comments = Comment[]

interface BoardProp {
  comments: Comments;
}

const ENDPOINT_LIST = "/api/board/getlist"; //コメントの一覧を取得するAPI
const ENDPOINT_INSERT = "api/board/comment" // コメント挿入するAPI

export default function Board({ comments }: { comments: WithId<Document>[] }) {
  // 型変換
  const data = comments as unknown as Comments;

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
  const postComment = (body: Comment) => {
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
      {isLoading && <Loader text="ナウ、アップローディン..."></Loader>}
      <main className={styles.main}>
        {commentState.map((comment, i) => {
          const { name, msg, posted } = comment;
          return <Comment key={i} name={name} msg={msg} posted={posted}></Comment>
        })}
        <div className={styles.commentButton} onClick={showModal}>Post Comment</div>
        {isModal && <Modal post={postComment} close={hideModal}></Modal>}
      </main>
    </>
  )
}

function Comment({ name, msg, posted }: Comment) {
  return (
    <div className={styles.commentWrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.msg}>{msg}</div>
      <div className={styles.when}>{posted}</div>
    </div>
  );
}