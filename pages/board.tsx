import Loader from "../component/Loader";
import Modal from "../component/Modal";
import MyHead from "../component/MyHead";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import { MODE } from "../component/constants";
import styles from "../styles/Board.module.css";
import React, { useState } from "react";

interface CommentProp {
  name: string,
  msg: string,
}

export default function Board() {

  const [isModal, setModal] = useState(false);
  const showModal = (e: React.MouseEvent<HTMLDivElement>) => setModal(true);
  const hideModal = (e: React.MouseEvent<HTMLDivElement> | null) => setModal(false);
  return (
    <>
      <MyHead title="掲示板"></MyHead>
      <Menu iniMode={MODE.BOARD}></Menu>
      <main className={styles.main}>
        <Comment name="全力君" msg="こんにちわ。Wuzzup,boys and girls!"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweoir"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweasdfasdfaslkdjfalsdjfalsdjfal;fjaslfjasld oir"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweasdfasdfaslkdjfalsdjfalsdjfal;fjaslfjasld oir"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweasdfasdfaslkdjfalsdjfalsdjfal;fjaslfjasld oir"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweasdfasdfaslkdjfalsdjfalsdjfal;fjaslfjasld oir"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweasdfasdfaslkdjfalsdjfalsdjfal;fjaslfjasld oir"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweasdfasdfaslkdjfalsdjfalsdjfal;fjaslfjasld oir"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweasdfasdfaslkdjfalsdjfalsdjfal;fjaslfjasld oir"></Comment>
        <Comment name="全力君" msg="aasdlfkjasdlfjasldfjasldfjalsdjfalsdjfaeowuiruqweoruasldfja;lfjasdfakjldsf;adsaaaasasasasasasasasasasasasasasasasasasasasasasasasasweasdfasdfaslkdjfalsdjfalsdjfal;fjaslfjasld oir"></Comment>
        <div className={styles.commentButton} onClick={showModal}>Post Comment</div>
      </main>
      {isModal && <Modal hideModal={hideModal}></Modal>}
      <Footer></Footer>
    </>
  );
}

function Comment({ name, msg }: CommentProp) {
  return (
    <div className={styles.commentWrapper}>
      <div className={styles.name}>{name}</div>
      <div className={styles.msg}>{msg}</div>
      <div className={styles.when}>{new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" })}</div>
    </div>
  );
}