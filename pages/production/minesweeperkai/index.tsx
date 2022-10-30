import { useEffect, useState, useReducer, useRef } from "react";
import { loadSprite } from "../../../lib/mskai/loader";
import type { Sprites } from "../../../lib/mskai/loader";
import { reducer, iniState, genAction } from "../../../lib/mskai/reducer"
import {
  getGroundSpriteIndex, getSmileSpriteIndex, getRemainsSpriteIndices, getTimerSpriteIndices,
} from "../../../lib/mskai/game";
import { EASY, MEDIUM, HARD, EXTREME, ACTION } from "../../../lib/mskai/constants";
import type { LevelKeyType } from "../../../lib/mskai/level";
import { WIN, LOSE, PLAY } from "../../../lib/mskai/constants";
import MyHead from "../../../component/MyHead";
import Footer from "../../../component/Footer";
import Menu from "../../../component/Menu";
import Description from "../../../component/minesweeperkai/Description";
import { MODE } from "../../../component/constants";
import style from "../../../styles/Mskai.module.css";

/**
 * levelに応じたclassNameを返す
 * style.board -> gridのcolumns数
 * styles.infoWrapper -> grindのcolumns数によって幅を変える　
 * @param level number
 * @returns string[]:[boardのスタイル、infoWrapperのスタイル]
 */
function getStyles(level: number) {
  let boardStyle = style.board;
  let infoStyle = style.infoWrapper;
  if (level === EASY) {
    boardStyle += " " + style.easyCols;
    infoStyle += " " + style.easyInfoWidth;
  } else if (level === MEDIUM) {
    boardStyle += " " + style.mediumCols;
    infoStyle += " " + style.mediumInfoWidth;
  } else if (level === HARD) {
    boardStyle += " " + style.hardCols;
    infoStyle += " " + style.hardInfoWidth;
  } else if (level === EXTREME) {
    boardStyle += " " + style.extremeCols;
    infoStyle += " " + style.extremeInfoWidth;
  }
  return [infoStyle, boardStyle];
}


export default function Page() {
  const [game, dispatch] = useReducer(reducer, iniState(EASY));
  const [handler, setHandler] = useState<Sprites | null>(null);
  const [timer, setTimer] = useState(0);
  const [isModal, setModal] = useState(false);
  const ref = useRef<number | null>(null);

  // level押下
  const changeLevel = (lvl: LevelKeyType) => {
    setTimer(0);
    removeTick();
    ref.current = null;
    dispatch(genAction(ACTION.INIT, { level: lvl }));
  };

  const leftClick = (i: number) => dispatch(genAction(ACTION.CLICK, { i: i }));

  const rightClick = (e: React.MouseEvent<HTMLImageElement>, i: number) => {
    e.preventDefault();
    dispatch(genAction(ACTION.CONTEXT, { i: i }))
  };

  const doubleClick = (e: React.MouseEvent<HTMLImageElement>, i: number) => {
    e.preventDefault();
    dispatch(genAction(ACTION.DOUBLE, { i: i }));
  }

  const smilePressed = () => dispatch(genAction(ACTION.SMILE_DOWN, {}));
  const smileReleased = () => {
    changeLevel(game.level);
  };

  const showModal = () => setModal(true);
  const closeModal = () => setModal(false);

  const tick = () => setTimer(timer => timer += 1);
  const removeTick = () => {
    const tid = ref.current;
    if (tid !== null) {
      window.clearInterval(tid);
    }
  }
  const getMessage = () => {
    if (game.gameState === PLAY) return "PLAYING...";
    if (game.gameState === LOSE) return "地雷撤去に失敗...";
    if (game.gameState === WIN) return `おめでとう！${timer}秒で全ての地雷を撤去しました！`;
    return "";
  }

  useEffect(() => {
    const sp = loadSprite("/minesweeper.png");
    sp.then(handler => setHandler(handler))
  }, []);

  useEffect(() => {
    const tid = ref.current;
    if (game.isGroundSet && game.gameState === PLAY && tid === null) {
      ref.current = window.setInterval(() => tick(), 1000);
    } else if (!game.isGroundSet || game.gameState !== PLAY) {
      removeTick();
    }

    return () => {
      if (tid !== null) {
        window.clearInterval(tid);
      }
    };
  }, [game.gameState, game.isGroundSet]);

  const [infoStyle, boardStyle] = getStyles(game.level);


  if (!handler || !game) {
    return <div>loading...</div>
  }

  return (
    <>
      <MyHead title="マインスイーパー改"></MyHead>
      <Menu iniMode={MODE.PRODUCTION}></Menu>
      <main className={style.container}>
        {isModal && <Description closeModal={closeModal} />}
        <LevelSelect currentLevel={game.level} changeLevel={changeLevel}></LevelSelect>
        <div className={style.boardWrapper}>
          <div className={infoStyle}>
            <div>
              {getRemainsSpriteIndices(game).map((spIndex, i) => {
                const url = handler.number.getUrl(spIndex);
                return (<img key={i} src={url} />);
              })}
            </div>
            <div>
              {(() => {
                const spIndex = getSmileSpriteIndex(game);
                const url = handler.smile.getUrl(spIndex);
                return <img src={url} onMouseDown={smilePressed} onMouseUp={smileReleased} />
              })()}
            </div>
            <div>
              {getTimerSpriteIndices(timer).map((spIndex, i) => {
                const url = handler.number.getUrl(spIndex);
                return (<img key={i} src={url} />);
              })}
            </div>
          </div>
          <div className={boardStyle}>
            {game.tiles.map((arr, i) => {
              const spIndex = getGroundSpriteIndex(game, i);
              const url = handler.layer.getUrl(spIndex);
              return (
                <Tile key={i} index={i} src={url}
                  leftClick={leftClick} rightClick={rightClick} doubleClick={doubleClick}
                />
              );
            })}
          </div>
        </div>
        <div className={style.message}>{getMessage()}</div>
        <a href="#"
          className={style.rule}
          onClick={(e) => {
            e.preventDefault();
            showModal();
          }}
        >ルール説明</a>
      </main>
      <Footer></Footer>
    </>
  );
}


interface SelectProp {
  currentLevel: LevelKeyType,
  changeLevel: (i: LevelKeyType) => void,
}

function LevelSelect({ currentLevel, changeLevel }: SelectProp) {
  const genStyle = (lvl: LevelKeyType) => {
    if (currentLevel === lvl) {
      return `${style.level} ${style.underline}`;
    }
    return style.level;
  };

  const change = (lvl: LevelKeyType) => {
    if (lvl === currentLevel) return;
    changeLevel(lvl);
  }

  return (<div className={style.levelWrapper}>
    <span onClick={() => change(EASY)} className={genStyle(EASY)}>EASY</span>
    <span onClick={() => change(MEDIUM)} className={genStyle(MEDIUM)}>MEDIUM</span>
    <span onClick={() => change(HARD)} className={genStyle(HARD)}>HARD</span>
    <span onClick={() => change(EXTREME)} className={genStyle(EXTREME)}>極</span>
  </div>);
}

interface TileProp {
  src: string, index: number,
  leftClick: (i: number) => void,
  rightClick: (e: React.MouseEvent<HTMLImageElement>, i: number) => void,
  doubleClick: (e: React.MouseEvent<HTMLImageElement>, i: number) => void,
}

function Tile(
  { src, index, leftClick, rightClick, doubleClick }: TileProp
) {
  return (
    <img
      className={style.tile} src={src}
      onClick={() => leftClick(index)}
      onContextMenu={(e) => rightClick(e, index)}
      onDoubleClick={(e) => doubleClick(e, index)}
    >
    </img>
  );
}