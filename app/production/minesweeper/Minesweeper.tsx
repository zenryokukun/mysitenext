"use client"

import Image from "next/image"
import { useRef, useState, useEffect } from "react";
import {
  render, Board, leftClick, rightClick, doubleClick,
  loadSprite, setSize, scheduleTick, smileDown, smileUp,
  changeSmile
} from "../../../lib/ms/logic";

import style from "../../../styles/Minesweeper.module.css";


// game levels
const EASY = 0;
const MEDIUM = 1;
const HARD = 2;
// game states
const PLAY = 0;
const LOSE = 1;
const WIN = 2;

type levelInfo = {
  cols: number, rows: number, bombs: number, level: number
};
type AllLevels = {
  [key: string]: levelInfo,
}

interface GameProp {
  img: HTMLImageElement,
  board: Board,
  restart: () => void,
  gameClick: (state: number) => void,
}

interface DescProp {
  closeModal: () => void,
}

// columns,rows,bombs
const LEVEL: AllLevels = {
  [EASY]: { cols: 8, rows: 8, bombs: 8, level: EASY },
  [MEDIUM]: { cols: 16, rows: 16, bombs: 45, level: MEDIUM },
  [HARD]: { cols: 30, rows: 16, bombs: 90, level: HARD },
};

export default function Minesweeper() {
  // ルール説明モーダルを表示するために使う
  const [isModal, setModal] = useState<boolean>(false);
  // level変更でGameを再描写する。
  const [level, setLevel] = useState<number>(EASY);
  // スプライトシートのImageタグ。読取が完了したら再描写するためuseStateする。
  const [sprite, setSprite] = useState<HTMLImageElement | null>(null);
  // ゲーム版。初期化されたら再描写する。初期化はレベルボタン押下、😊マーク押下で実施。
  const [board, setBoard] = useState<Board | null>(null);
  // 画面下部のメッセージ
  const [gameState, setGameState] = useState(0);

  // 説明ボタンを押したときのモーダル制御関数
  const showModal = () => setModal(true);
  const closeModal = () => setModal(false);

  // smiley faceをクリックしたら、同じレベルで再プレイ。
  // boardのを現在のlevelで更新。
  const smileClick = () => {
    setBoard(new Board(LEVEL[level]));
  }

  /******************************************
   * レベルボタンをクリックしたら、クリックしたレベルでプレイ。
   * クリックしたレベルでboardを更新。
   */
  const easyClick = () => {
    setLevel(EASY);
    setBoard(new Board(LEVEL[EASY]));
  }

  const mediumClick = () => {
    setLevel(MEDIUM);
    setBoard(new Board(LEVEL[MEDIUM]));
  }

  const hardClick = () => {
    setLevel(HARD);
    setBoard(new Board(LEVEL[HARD]));
  }
  /******************************************* */

  // ゲーム版クリックした時、gameのstateが変わる可能性があるので、
  // Gameコンポーネントで左・右・ダブルクリックした時に実行する。
  const gameClick = (state: number) => setGameState(state);

  // スプライトシート読み取り処理とゲーム版の初期化。初回のみ実行。
  useEffect(() => {
    loadSprite("/minesweeper.png").then(img => setSprite(img));
    setBoard(new Board(LEVEL[level]));
  }, []);

  // 画面下部にgameStateに応じたメッセージを表示する関数
  const getMessage = () => {
    if (gameState === PLAY) return "PLAYING...";
    if (gameState === LOSE) return "地雷撤去に失敗...";
    if (gameState === WIN) return `おめでとう！${board?.time}秒で全ての地雷を撤去しました！`;
    return "";
  }

  // 選択したレベルに下線を表示するスタイルを取得する関数
  const getLevelStyle = (lv: number) => {
    if (lv === level) {
      return style.menu + " " + style.selected;
    }
    return style.menu;
  };

  return (
    <>
      {isModal && <Description closeModal={closeModal}></Description>}
      <main className={style.container}>
        <div className={style.menuWrapper}>
          <button className={getLevelStyle(EASY)} onClick={easyClick}>EASY</button>
          <button className={getLevelStyle(MEDIUM)} onClick={mediumClick}>MEDIUM</button>
          <button className={getLevelStyle(HARD)} onClick={hardClick}>HARD</button>
        </div>
        {sprite &&
          <Game img={sprite} board={board as Board}
            restart={smileClick} gameClick={gameClick} />
        }
        <div className={style.message}>{getMessage()}</div>
        <a onClick={showModal} className={style.rule} href="#rule">ルール説明</a>
      </main>
    </>
  )
}


// canvas部分のコンポーネント
const Game = ({ img, board, restart, gameClick }: GameProp) => {
  // useEffect内でcanvasに触れないといけないので。
  const ref = useRef<HTMLCanvasElement>(null);
  // 現在のcanvasからctxを取得する関数。
  const getCtx = () => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    return ctx;
  }

  // 左クリックイベント
  const click = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    leftClick(x, y, board);
    draw();
    gameClick(board.gameState); // gameState更新処理
  };

  // 右クリックイベント
  const contextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    rightClick(x, y, board);
    draw(); // 全画面描写
    gameClick(board.gameState); // gameState更新処理
  };

  //ダブルクリックイベント
  const double = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    doubleClick(x, y, board);
    draw(); // 全画面描写
    gameClick(board.gameState); // gameState更新処理
  };

  // smiley faceにmouseDownした時に画像を切り替える関数
  const mouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx) return;

    // smiley faceの枠内でmouseDownしていたら、画像切り替える。
    const isDown = smileDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY, board);
    if (isDown) {
      changeSmile(img, ctx, board);
    }
  };

  // smiley faceにmouseUpした時に画像を切り替える関数
  const mouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const ctx = getCtx();
    if (!ctx) return;

    // smiley faceの枠内でmouseDownしていたら、画像切り替えて、同じレベルで再プレイ。
    const isUp = smileUp(e.nativeEvent.offsetX, e.nativeEvent.offsetY, board);
    if (isUp) {
      changeSmile(img, ctx, board);
      restart(); // 同じレベルで再プレイ
    }
  };

  // 全画面描写
  const draw = () => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    render(img, ctx, board);
  }

  // 初回のみ実行。レベルに応じたゲームの初期状態を描写。
  // ゲームの進行に伴うcanvasの描写変更は、ctxで実行する
  // （それで良いのかは微妙。ググっても分からず。クリックごとにcanvasごと再レンダーしても良いかも？）
  useEffect(() => {

    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    // boardに応じたcanvasの大きさを設定
    setSize(cvs, board);

    // 経過秒数を更新する関数を取得し、毎秒実行スケジュール
    const fn = scheduleTick(img, ctx, board);
    const tid = window.setInterval(fn, 1000);

    // 全画面描写
    draw();

    // unmount時にsetIntervalのスケジュール解除
    return () => window.clearInterval(tid);
  });

  return (
    <canvas
      ref={ref} className={style.game}
      onClick={click}
      onContextMenu={contextMenu}
      onDoubleClick={double}
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
    ></canvas>
  )
};

/**description */
function Description({ closeModal }: DescProp) {
  return (
    <div className={style.modal}>
      <div onClick={closeModal} className={style.close}>X CLOSE</div>
      <div className={style.wrapper}>
        <section>
          <h1 className={style.headline}>マインスイーパーとは</h1>
          <p>1980年代に作成された、１人用コンピュータゲームです。地雷原から全ての地雷を撤去するのが目的です。
            Windows3.1～7までは標準で付属していたため、知名度が高いゲームです。
            残念ながらWindows8からはダウンロード形式になりました。
          </p>
        </section>
        <section>
          <h2 className={style.subHeadline}>ルール</h2>
          <ul>
            <li>
              マスをクリックすると開きます。
            </li>
            <li>
              地雷が隠れているマスをクリックすると負けです。
            </li>
            <li>
              地雷が隠れているマスには旗を立てて印をつけます。
            </li>
            <li>
              全ての地雷マスに旗を立て、それ以外のマスを全て開くと勝ちです。
            </li>
            <li>
              数字のマスは、隣接マスに埋まっている爆弾の数を示しています。
            </li>
            <li>
              左上の数字は、埋まっている爆弾の残数です。旗を立てると、1減ります。間違えていても減ります。
            </li>
            <li>
              右上の数字は経過秒数です。
            </li>
          </ul>
        </section>
        <section>
          <h2 className={style.subHeadline}>操作</h2>
          <ul>
            <li>
              左クリックでマスを開きます。
            </li>
            <li>
              右クリックで旗を立てます。
            </li>
            <li>
              数字マスをダブルクリックすると、隣接マスを全て開きます。旗が立っているマスは除外されます。
              時短に利用してください。
            </li>
            <div className={style.imgWrapper}>
              <Image
                className={style.descImg}
                src="/production/minesweeper/double-click.png"
                alt="double-click-explanation"
                width={250}
                height={380}
              />
            </div>
            <li>ニコニコボタンを押すと、同じレベルで再プレイできます</li>
            <li>上部のEASY MEDIUM HARDを押すと、レベル変更できます</li>
          </ul>
        </section>
      </div>
    </div >
  );
}