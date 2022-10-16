import MyHead from "../component/MyHead";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import { MODE } from "../component/constants";
import React, { useRef, useState, useEffect } from "react";
import {
  render, Board, leftClick, rightClick, doubleClick,
  loadSprite, setSize, scheduleTick, smileDown, smileUp,
  changeSmile
} from "../lib/ms/logic";
import style from "../styles/Minesweeper.module.css";

// game level
const EASY = 0;
const MEDIUM = 1;
const HARD = 2;

type LevelKey = (0 | 1 | 2);
type levelInfo = {
  cols: number, rows: number, bombs: number, level: number
};
type AllLevels = {
  [key: string]: levelInfo,
}

interface GameProp {
  img: HTMLImageElement,
  info: levelInfo, // [columns,rows,bombs]
  changeLevel: (selectedLevel: number) => void,
  level: number
}

// columns,rows,bombs
const LEVEL: AllLevels = {
  [EASY]: { cols: 8, rows: 8, bombs: 8, level: EASY },
  [MEDIUM]: { cols: 16, rows: 16, bombs: 45, level: MEDIUM },
  [HARD]: { cols: 30, rows: 16, bombs: 90, level: HARD },
};

const Page = () => {

  // level変更でGameを再描写する。
  const [level, setLevel] = useState<number>(EASY);
  // スプライトシートのImageタグ。読取が完了したら再描写するためuseStateする。
  const [sprite, setSprite] = useState<HTMLImageElement | null>(null);
  const [redo, setRedo] = useState<number>(0);
  // levelの更新はGame内の特定ボタン押下で行う。
  const changeLevel = (selectedLevel: number) => setLevel(selectedLevel);
  const easyClick = () => {
    setLevel(EASY)
    setRedo(red => redo + 1)
  };
  const mediumClick = () => setLevel(MEDIUM);
  const hardClick = () => setLevel(HARD);
  // スプライトシート読み取り処理。初回のみ実行。
  useEffect(() => {
    loadSprite("/minesweeper.png").then(img => setSprite(img));
  }, []);

  const levelInfo = LEVEL[level as LevelKey];
  return (
    <>
      <MyHead title="Minesweeper"></MyHead>
      <Menu iniMode={MODE.PRODUCTION}></Menu>
      <div className={style.menuWrapper}>
        <button className={style.menu} onClick={easyClick}>EASY</button>
        <button className={style.menu} onClick={mediumClick}>MEDIUM</button>
        <button className={style.menu} onClick={hardClick}>HARD</button>
      </div>
      <main>
        {sprite &&
          <Game img={sprite} info={levelInfo}
            changeLevel={changeLevel} level={EASY} />
        }
      </main>
      <Footer></Footer>
    </>
  );
};

const Game = ({ img, info, changeLevel, level }: GameProp) => {
  // useEffect内でcanvasに触れないといけないので。
  const ref = useRef<HTMLCanvasElement>(null);
  // ボードを初期化
  const board = new Board(info);
  // 左クリックイベント
  const click = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    leftClick(x, y, board);
    // renderer.draw(board);
    draw();
  };

  // 右クリックイベント
  const contextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    rightClick(x, y, board);
    draw();
  };

  //ダブルクリックイベント
  const double = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    doubleClick(x, y, board);
    draw();
  };

  const mouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const isDown = smileDown(e.nativeEvent.offsetX, e.nativeEvent.offsetY, board);
    if (isDown) {
      changeSmile(img, ctx, board);
    }
  };

  const mouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const isUp = smileUp(e.nativeEvent.offsetX, e.nativeEvent.offsetY, board);
    if (isUp) {
      changeSmile(img, ctx, board);
      changeLevel(level);
    }
  };

  const draw = () => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    render(img, ctx, board);
  }

  // 初回のみ実行。レベルに応じたゲームの初期状態を描写。
  // ゲームの進行に伴うcanvasの描写変更は、Reactによるcanvasの再描写でなく、ctxを用いて実行する
  // （それで良いのかは微妙。ググっても分からず。クリックごとにcanvasごと再レンダーしても良いかも？）
  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    setSize(cvs, board);

    const fn = scheduleTick(img, ctx, board);
    const tid = window.setInterval(fn, 1000);

    draw();

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

export default Page;