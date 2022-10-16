
//  sp's area
// __TILE_SP=[
// 	(0,23,16,16),(16,23,16,16),(32,23,16,16),(48,23,16,16),
// 	(64,23,16,16),(80,23,16,16),(96,23,16,16),(112,23,16,16),
// 	(128,23,16,16),(0,39,16,16),(16,39,16,16),(32,39,16,16),
// 	(48,39,16,16),(64,39,16,16)
// ]

import { decodedTextSpanIntersectsWith } from "typescript";

// __SMILE_SP = [(0,55,27,26),(27,55,26,26),(52,55,26,26),(78,55,26,26),(104,55,26,26)]
// __NUMS_SP = [(0,0,13,23),(13,0,13,23),(26,0,13,23),(39,0,13,23),(52,0,13,23),(65,0,13,23),(78,0,13,23),(91,0,13,23),(104,0,13,23),(117,0,13,23),(130,0,13,23)]

// sizes (width,height)
// __TILE_SIZE = (25,25)
// __NUMS_SIZE = (20,36)
// __SMILE_SIZE = (40,40)

const TILE_SP = [
    [0, 23, 16, 16], // EMPTY
    [16, 23, 16, 16], // 1
    [32, 23, 16, 16], // 2
    [48, 23, 16, 16], // 3
    [64, 23, 16, 16], // 4
    [80, 23, 16, 16], // 5
    [96, 23, 16, 16], // 6
    [112, 23, 16, 16],// 7
    [128, 23, 16, 16],// 8
    [0, 39, 16, 16],  // COVERED
    [16, 39, 16, 16], // FLAG
    [32, 39, 16, 16], // REDBOMB
    [48, 39, 16, 16], // NG_BOMB
    [64, 39, 16, 16]  // BOMB
];

const SMILE_SP = [
    [0, 55, 27, 26], // smile
    [27, 55, 26, 26],// smile presssed
    [52, 55, 26, 26],// ?
    [78, 55, 26, 26],// lost
    [104, 55, 26, 26]// win
]

const NUMS_SP = [
    [0, 0, 13, 23],
    [13, 0, 13, 23],
    [26, 0, 13, 23],
    [39, 0, 13, 23],
    [52, 0, 13, 23],
    [65, 0, 13, 23],
    [78, 0, 13, 23],
    [91, 0, 13, 23],
    [104, 0, 13, 23],
    [117, 0, 13, 23],
    [130, 0, 13, 23]
];

// width,height
const TILE_SIZE = [25, 25];
const SMILE_SIZE = [40, 40];
const NUMS_SIZE = [20, 36]

// ゲーム版のoffset
const OFFSET_LEFT = 20;
const OFFSET_TOP = 20 + SMILE_SIZE[1];
const BORDER_OFFSET = 4;
const MARGIN_BOTTOM = 20;
// 情報版のoffset
const OFFSET_INFO_TOP = 20;

// sprite indices
const EMPTY = 0;
const COVERED = 9;
const FLAG = 10;
const RED_BOMB = 11;
const NG_BOMB = 12;
const BOMB = 13;

// tile state
const NOT_OPEN = 0;
const FLAGGED = 1;
const OPEN = 2;

// smile state;
const SMILE = 0;
const SMILE_PRESSED = 1;
const LOSE = 2;
const WIN = 3;



/**
 * 画像のパスを取得し、Image要素を返す。
 * Image要素にresolveするPromiseを返す
 * @param imgPath 画像ファイルのパス
 * @returns Image要素にresolveするPromise
 */
export function loadSprite(imgPath: string): Promise<HTMLImageElement> {
    const prom = new Promise((res: (img: HTMLImageElement) => void, rej) => {
        const img = new Image();
        img.addEventListener("load", () => res(img));
        img.src = imgPath;
    });
    return prom;
}

export function setSize(cvs: HTMLCanvasElement, board: Board) {
    cvs.width = board.width;
    cvs.height = board.height;
}



/**
 * MouseEventが発生した座標軸から、2次元配列[rows][cols]のindexを計算し、[col,row]を返す。
 * @param eventX MouseEventが発生した要素を起点にしたx座標軸
 * @param eventY MouseEventが発生した要素を起点にしたy座標軸
 * @returns [col,row]
 */
function getPos(eventX: number, eventY: number, offsetX: number = 0, offsetY: number = 0): [number, number] {
    const col = Math.floor((eventX - offsetX) / TILE_SIZE[0]);
    const row = Math.floor((eventY - offsetY) / TILE_SIZE[1]);
    return [col, row];
}

function openTile(x: number, y: number, board: Board) {
    if (board.isCovered(x, y)) {
        board.setTileState(x, y, OPEN);
        if (board.ground[y][x] === EMPTY) {
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    if (r === 0 && c === 0) continue;
                    const nx = x + c;
                    const ny = y + r;
                    if (!board.isIn(nx, ny)) continue;
                    openTile(nx, ny, board);
                }
            }
        }
    }
}

export function leftClick(eventX: number, eventY: number, board: Board) {
    const [x, y] = getPos(eventX, eventY, board.offsetLeft, board.offsetTop);
    if (!board.isIn(x, y)) return;

    if (!board.isGroundSet) {
        board.initGround(x, y);
    }
    openTile(x, y, board);
}

export function rightClick(eventX: number, eventY: number, board: Board) {
    const [x, y] = getPos(eventX, eventY, board.offsetLeft, board.offsetTop);
    if (!board.isIn(x, y)) return;
    if (board.isCovered(x, y)) {
        board.setTileState(x, y, FLAGGED);
        board.guessed(-1);
    } else if (board.isFlagged(x, y)) {
        board.setTileState(x, y, NOT_OPEN);
        board.guessed(1);
    }
}

export function doubleClick(eventX: number, eventY: number, board: Board) {
    const [x, y] = getPos(eventX, eventY, board.offsetLeft, board.offsetTop);
    if (!board.isIn(x, y)) return;
    if (board.isOpen(x, y) && board.isNumber(x, y)) {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                if (r === 0 && c === 0) continue;
                const nx = x + c;
                const ny = y + r;
                if (!board.isIn(nx, ny)) continue;
                if (board.isCovered(nx, ny)) {
                    openTile(nx, ny, board);
                }
            }
        }
    }
}

export function smileDown(x: number, y: number, board: Board) {
    const w = SMILE_SIZE[0];
    const h = SMILE_SIZE[1];
    const tx = board.width / 2 - w / 2;
    const ty = OFFSET_INFO_TOP;
    const isOnSmile = (x > tx && x < tx + w && y > ty && y < ty + h);
    if (isOnSmile) {
        board.setSmileState(SMILE_PRESSED);
    }
    return isOnSmile;
}


export function smileUp(x: number, y: number, board: Board) {
    const w = SMILE_SIZE[0];
    const h = SMILE_SIZE[1];
    const tx = board.width / 2 - w / 2;
    const ty = OFFSET_INFO_TOP;
    const isOnSmile = (x > tx && x < tx + w && y > ty && y < ty + h);
    if (isOnSmile) {
        board.setSmileState(SMILE);
    }
    return isOnSmile;
}



export function scheduleTick(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    const fn = () => {
        board.tick();
        clearTime(ctx, board);
        renderTime(img, ctx, board);
    };
    return fn;
}



export class Board {

    tiles: number[][];
    ground: number[][];
    isGroundSet: boolean;
    state: number;
    time: number;
    timerID: number;
    cols: number;
    rows: number;
    width: number;
    height: number;
    guess: number;
    offsetTop: number;
    offsetLeft: number;
    private bombs: number;

    constructor({ cols, rows, bombs }: { cols: number, rows: number, bombs: number }) {

        this.tiles = [];
        this.ground = [];
        this.isGroundSet = false;
        this.state = SMILE;
        this.bombs = bombs;
        this.cols = cols;
        this.rows = rows;
        this.width = cols * TILE_SIZE[0] + OFFSET_LEFT * 2;
        this.height = rows * TILE_SIZE[1] + OFFSET_TOP + MARGIN_BOTTOM * 2;
        this.guess = bombs;
        this.time = 0;
        this.timerID = 0;
        this.offsetTop = OFFSET_TOP + MARGIN_BOTTOM;
        this.offsetLeft = OFFSET_LEFT;

        for (let r = 0; r < rows; r++) {
            this.tiles.push([]);
            this.ground.push([]);
            for (let c = 0; c < cols; c++) {
                this.tiles[r][c] = NOT_OPEN;
                this.ground[r][c] = EMPTY;
            }
        }
    }

    setSmileState(state: number) {
        this.state = state;
    }

    setTileState(x: number, y: number, state: number) {
        this.tiles[y][x] = state;
    }

    // 右クリックでbomb予想数を±1する
    guessed(val: number) {
        this.guess += val;
    }

    // 時間更新
    tick() {
        if (this.time >= 1000 || !this.isGroundSet) {
            return;
        }
        this.time += 1;
    }

    setTimer(tid: number) {
        this.timerID = tid;
    }

    // clicked x, clicked y
    initGround(cx: number, cy: number) {
        const rows = this.rows;
        const cols = this.cols;
        const maxlen = rows * cols;

        // bombをセットする位置を格納。１次元配列なので注意。
        const bIndices = [];
        for (let i = 0; i < maxlen; i++) {
            bIndices.push(i);
        }

        // clickされたマスと、その隣接マスも除外する
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const nx = cx + c;
                const ny = cy + r;
                if (!this.isIn(nx, ny)) {
                    continue;
                }
                // ２二次元配列の行列のindexを１次元のindexに変換の上
                // 候補から除外
                const delVal = ny * cols + nx;
                const delIndex = bIndices.indexOf(delVal);
                bIndices.splice(delIndex, 1);
            }
        }
        // bombをランダムにセット
        for (let i = 0; i < this.bombs; i++) {
            const rval = Math.random() * bIndices.length;
            const rIndex = Math.floor(rval);
            const bombIndex = bIndices[rIndex];
            const bx = bombIndex % cols;
            const by = Math.floor(bombIndex / cols);
            this.ground[by][bx] = BOMB;
            // 選ばれた要素がまた選ばれないように除外。
            bIndices.splice(rIndex, 1);
        }

        // bombの隣接マスに数字を瀬セット
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // bombマスでない場合、スキップして次の走査へ。
                if (!this.isBomb(c, r)) {
                    continue;
                }
                // bombマスの場合、隣接マスのbomb数を1増やす
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        // bombマスの場合は処理しないのでスキップ
                        if (dr === 0 && dc === 0) {
                            continue;
                        }
                        const nr = r + dr;
                        const nc = c + dc;
                        // 枠からはみ出る場合はスキップ
                        if (!this.isIn(nc, nr)) {
                            continue;
                        }
                        // bombマスでなければ数を増やす
                        if (!this.isBomb(nc, nr)) {
                            this.ground[nr][nc] += 1;
                        }
                    }
                }
            }

            this.isGroundSet = true;
        }
    }

    isIn(x: number, y: number) {
        const rows = this.rows;
        const cols = this.cols;
        return (x >= 0 && x < cols && y >= 0 && y < rows);
    }

    /**********************
    *     ground state 
    **********************/
    isBomb(x: number, y: number) {
        return this.ground[y][x] === BOMB;
    }

    isNumber(x: number, y: number) {
        const val = this.ground[y][x];
        return val >= 1 && val <= 8;
    }

    /**********************
    *     tile state 
    **********************/
    isCovered(x: number, y: number) {
        return this.tiles[y][x] === NOT_OPEN;
    }

    isFlagged(x: number, y: number) {
        return this.tiles[y][x] === FLAGGED;
    }

    isOpen(x: number, y: number) {
        return this.tiles[y][x] === OPEN;
    }

    // 座標軸(x,y)から描写するspriteのインデックスを取得する
    getSpriteIndex(x: number, y: number) {
        const tile = this.tiles[y][x];
        const ground = this.ground[y][x];
        if (tile === NOT_OPEN) {
            return COVERED;
        }
        if (tile === FLAGGED) {
            return FLAG;
        }
        return ground;
    }
}



export function render(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    renderTime(img, ctx, board);
    renderGuess(img, ctx, board);
    renderSmile(img, ctx, board);
    renderTile(img, ctx, board);
    renderFrame(img, ctx, board);
    renderInfoFrame(img, ctx, board);
}

function renderGuess(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    let val = board.guess;
    if (val >= 1000) {
        val = 999;
    }
    if (val < 0) {
        val = 0;
    }
    const hundreds = Math.floor(val / 100);
    const tens = Math.floor(val / 10);
    const ones = val % 10;
    const hsp = NUMS_SP[hundreds];
    const tsp = NUMS_SP[tens];
    const osp = NUMS_SP[ones];
    const [w, h] = NUMS_SIZE;
    ctx.drawImage(img, hsp[0], hsp[1], hsp[2], hsp[3], OFFSET_LEFT, OFFSET_INFO_TOP, w, h);
    ctx.drawImage(img, tsp[0], tsp[1], tsp[2], tsp[3], OFFSET_LEFT + w, OFFSET_INFO_TOP, w, h)
    ctx.drawImage(img, osp[0], osp[1], osp[2], osp[3], OFFSET_LEFT + w * 2, OFFSET_INFO_TOP, w, h)
}

function clearTime(ctx: CanvasRenderingContext2D, board: Board) {
    const [w, h] = NUMS_SIZE;
    const ew = board.width - OFFSET_LEFT;
    ctx.clearRect(ew, OFFSET_TOP, ew + 3 * w, OFFSET_INFO_TOP);
}

function renderTime(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    let val = board.time;
    if (val >= 1000) {
        val = 999;
    }
    if (val < 0) {
        val = 0;
    }
    const hundreds = Math.floor(val / 100);
    const tens = Math.floor(val % 100 / 10);
    const ones = val % 10;
    const hsp = NUMS_SP[hundreds];
    const tsp = NUMS_SP[tens];
    const osp = NUMS_SP[ones];
    const [w, h] = NUMS_SIZE;
    const ew = board.width - OFFSET_LEFT;
    ctx.drawImage(img, hsp[0], hsp[1], hsp[2], hsp[3], ew - 3 * w, OFFSET_INFO_TOP, w, h);
    ctx.drawImage(img, tsp[0], tsp[1], tsp[2], tsp[3], ew - 2 * w, OFFSET_INFO_TOP, w, h)
    ctx.drawImage(img, osp[0], osp[1], osp[2], osp[3], ew - w, OFFSET_INFO_TOP, w, h)
}

export function changeSmile(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    clearSmile(ctx, board);
    renderSmile(img, ctx, board);
}

function clearSmile(ctx: CanvasRenderingContext2D, board: Board) {
    const [w, h] = SMILE_SIZE;
    const sx = board.width / 2 - w / 2;
    const sy = OFFSET_INFO_TOP;
    ctx.clearRect(sx, sy, w, h);
}

function renderSmile(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    const { cols, state } = board;
    const width = SMILE_SIZE[0];
    const canvasWidth = cols * TILE_SIZE[0] + OFFSET_LEFT * 2;
    const tile = SMILE_SP[state];
    const [posx, posy] = [canvasWidth / 2 - width / 2, OFFSET_INFO_TOP];
    ctx.drawImage(img, tile[0], tile[1], tile[2], tile[3], posx, posy, SMILE_SIZE[0], SMILE_SIZE[1]);
}

function renderInfoFrame(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    const { cols, rows } = board;
    ctx.lineWidth = BORDER_OFFSET;
    const left = OFFSET_LEFT - BORDER_OFFSET + 2;
    const top = OFFSET_INFO_TOP - BORDER_OFFSET - 5;
    const bottom = top + SMILE_SIZE[1] + BORDER_OFFSET * 2 + 7;
    const right = left + cols * TILE_SIZE[0] + BORDER_OFFSET * 2 - 4;
    ctx.strokeStyle = "#aaa";
    ctx.beginPath();
    ctx.moveTo(left, top - 1.5);
    ctx.lineTo(left, bottom + 2);
    ctx.moveTo(left - 1.5, top);
    ctx.lineTo(right, top);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = "#e0e0e0";
    ctx.beginPath();
    ctx.moveTo(left + 2, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right, top - 2);
    ctx.stroke();
    ctx.closePath();
}

function renderFrame(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    const { cols, rows } = board;
    ctx.lineWidth = BORDER_OFFSET;
    const left = OFFSET_LEFT - BORDER_OFFSET + 2;
    const top = OFFSET_TOP - BORDER_OFFSET + 2 + MARGIN_BOTTOM;
    const bottom = top + rows * TILE_SIZE[1] + BORDER_OFFSET * 2 - 4;
    const right = left + cols * TILE_SIZE[0] + BORDER_OFFSET * 2 - 4;

    ctx.strokeStyle = "#aaa";
    ctx.beginPath();
    ctx.moveTo(left, top - 1.5);
    ctx.lineTo(left, bottom + 2);
    ctx.moveTo(left - 1.5, top);
    ctx.lineTo(right, top);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = "#e0e0e0";
    ctx.beginPath();
    ctx.moveTo(left + 2, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right, top - 2);
    ctx.stroke();

    ctx.closePath();
}

function renderTile(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    const rows = board.rows;
    const cols = board.cols;
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const index = board.getSpriteIndex(x, y);
            const tile = TILE_SP[index];
            const posx = x * TILE_SIZE[0] + board.offsetLeft;
            const posy = y * TILE_SIZE[1] + board.offsetTop;
            ctx.drawImage(img, tile[0], tile[1], tile[2], tile[3], posx, posy, TILE_SIZE[0], TILE_SIZE[1]);
        }
    }
}