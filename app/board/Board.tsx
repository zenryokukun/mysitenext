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
import type { WithId } from "mongodb"
import type { CommentInfo } from "../../types"


const ENDPOINT_LIST = "/api/board/getlist"; //コメントの一覧を取得するAPI
const ENDPOINT_INSERT = "api/board/comment" // コメント挿入するAPI

interface ThreadHandler {
  seq: number | null;
  set: (s: number | null) => void
}

// スレッドのIDを管理するオブジェクト。
// useStateでも良いのだが、描写に直接関係しないため、外出し。
const threadHandler: ThreadHandler = {
  seq: null,
  set: function (seq: number | null) {
    this.seq = seq;
  }
}

// Modalに渡す関数。型共有できるようにexport。
export interface PostBody {
  name: string;
  msg: string;
  parentSeq: null | number;
  topic: string;
}

export default function Board({ comments }: { comments: WithId<CommentInfo>[] }) {

  const [isModal, setModal] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const [commentState, setComment] = useState(comments);

  // post commentボタン押下時、モーダルを開く
  const showModal = (seq: number | null) => {
    setModal(true);
    threadHandler.set(seq);
  }
  // モーダルのcloseボタンを押下時、モーダルを閉じる。Modalコンポーネントで実行する。
  const hideModal = () => setModal(false);
  // コメントが新たにポストされたらコメント表示を一新する。Modal コンポーネントで実行する。
  const reload = () => {
    fetch(ENDPOINT_LIST).then(data => data.json()).then(newComments => setComment(newComments));
  };

  // モーダルのpostボタン押下時処理。Modal コンポーネントで呼ぶ。
  const postComment = (body: PostBody) => {
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
      {/* <h1 className={styles.bg}>みんなの掲示板</h1>
      <div className={styles.bg} >
        <div style={{ width: "90%", margin: "auto" }}>仲良く会話しましょう。<br />新規のスレッドを立てる場合は、「Post Comment」ボタンから投稿してください。</div>
      </div> */}
      <main className={styles.main}>
        <h1>みんなの掲示板</h1>
        <div className={styles.descriptionWrapper}>
          <div>仲良く会話しましょう。</div>
          <div>新規のスレッドを立てる場合は、「Post Comment」ボタンから投稿してください。</div>
        </div>
        <Message comments={commentState} showModal={(seq: number) => showModal(seq)} />
        <div className={styles.commentButton} onClick={() => showModal(null)}>Post Comment</div>
        {isModal && <Modal post={postComment} close={hideModal} parentSeq={threadHandler.seq}></Modal>}
      </main>
    </>
  )
}


interface MessageProp {
  comments: CommentInfo[];
  showModal: (seq: number) => void;
}

function Message({ comments, showModal }: MessageProp) {
  // threadを抽出。threadはparentSeqがnull。
  const threads = comments.filter(cmt => cmt.parentSeq === null);
  return (
    <>
      {threads.map((thread, i) => {
        // スレッド傘下のコメントを抽出。
        const conversation = comments.filter(cmt => cmt.parentSeq === thread.threadSeq);
        return <Thread key={i} thread={thread} conversation={conversation} showModal={showModal} />
      })}
    </>
  );
}


interface ThreadProp {
  thread: CommentInfo;
  conversation: CommentInfo[];
  showModal: (seq: number) => void;
}
function Thread({ thread, conversation, showModal }: ThreadProp) {
  const [showConversation, setShowConversation] = useState(false);
  const { topic, name, msg, posted, threadSeq } = thread;
  return (
    <>
      <div className={styles.commentWrapper}>
        {topic && topic.length !== 0 && <div className={styles.topic}>{topic}</div>}
        <div className={styles.name}>[投稿者]: {name}</div>
        <div className={styles.msg}>{msg}</div>
        <div className={styles.when}>{posted}</div>
        {showConversation &&
          <div>
            {conversation.map((cmt, i) => <Comment key={i} {...cmt} />)}
          </div>}
        <button className={styles.showReply} onClick={() => setShowConversation(() => !showConversation)}>
          {showConversation ? "返信を非表示にする" : `返信を表示する ${conversation.length}件`}
        </button>
        <button className={styles.reply} onClick={() => showModal(threadSeq as number)}>このスレッドに返信する</button>
      </div>
    </>
  );
}

function Comment({ name, msg, posted, replySeq }: CommentInfo) {
  return (
    <>
      <div className={styles.replyWrapper}>
        <div className={styles.name}>No.{replySeq} [投稿者]: {name}</div>
        <div className={styles.msg}>{msg}</div>
        <div className={styles.when}>{posted}</div>
      </div>
    </>
  );
}
