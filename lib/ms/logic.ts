
// ********************************************************
//                           定数
// ********************************************************

// 地雷版のSprite情報:[x,y,width,height]
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

// smiley faceのSprite情報:[x,y,width,height]
const SMILE_SP = [
    [0, 55, 27, 26],  // smile
    [27, 55, 26, 26], // smile presssed
    [52, 55, 26, 26], // ?
    [78, 55, 26, 26], // lost
    [104, 55, 26, 26] // win
]

// 数字のSprite情報:[x,y,width,height]
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

// 各Spriteの大きさ:[width,height]
const TILE_SIZE = [25, 25];
const SMILE_SIZE = [40, 40];
const NUMS_SIZE = [20, 36]

// ゲーム版のoffset
const OFFSET_LEFT = 20; // 地雷版の左からの開始位置 
const OFFSET_TOP = 20 + SMILE_SIZE[1]; //地雷版の上からの開始一
const BORDER_OFFSET = 4; // 地雷版、情報版の枠線のoffset
const MARGIN_BOTTOM = 20; // 地雷版、情報版下段の余白
const OFFSET_INFO_TOP = 20; // 情報版の上からのoffset


// 地雷版の各マスのspriteの添え時に対応した定数
const EMPTY = 0; // 空白マス。隣接マスに地雷が無い&自分も地雷でない。
const COVERED = 9;
const FLAG = 10;
const RED_BOMB = 11;
const NG_BOMB = 12;
const BOMB = 13;

// 地雷版の各マスの状態を3つに分類
const NOT_OPEN = 0; // まだ地面が見えていないマス
const FLAGGED = 1;  // 旗を立ててあるマス
const OPEN = 2;     // 既に開いて地面が見えているマス

// smiley faceのspriteの添え時に対応した定数;
const SMILE = 0;
const SMILE_PRESSED = 1;
const SMILE_LOSE = 2;
const SMILE_WIN = 4;

// gameの状態を3つに分類
const PLAY = 0;
const LOSE = 1;
const WIN = 2;
// 定数終了****************************************************



/**
 * 仮引数の画像のパスから、Image要素にresolveするPromiseを返す
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

/**
 * Boardに応じたゲーム版の大きさをCanvasに設定する
 * @param cvs Canvas要素
 * @param board Board
 */
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

/**
 * クリックしたマスを開く関数。  
 * 空白マスをクリックした場合、隣接マスを全て開く。その中に
 * 空白マスがあれば、その隣接マスも全て開く。再帰処理。
 * @param x クリックした座標軸をgetPosで添え時に変換したx値
 * @param y クリックした座標軸をgetPosで添え時に変換したy値
 * @param board  
 */
function openTile(x: number, y: number, board: Board) {
    // 開いていない&&旗が立っていないマスなら
    if (board.isCovered(x, y)) {
        // そのマスを開く
        board.setTileState(x, y, OPEN);
        // 空白マスなら
        if (board.ground[y][x] === EMPTY) {
            // 隣接マスを走査
            for (let r = -1; r <= 1; r++) {
                for (let c = -1; c <= 1; c++) {
                    // この場合は自分自身（隣接マスでない）のでスキップ
                    if (r === 0 && c === 0) continue;
                    // 隣接マスの添え時を計算
                    const nx = x + c;
                    const ny = y + r;
                    // 枠外ならスキップ
                    if (!board.isIn(nx, ny)) continue;
                    // 隣接マスは再帰呼び出しして開く
                    openTile(nx, ny, board);
                }
            }
        }
        // 地雷をクリックしたら負け処理
        if (board.isBomb(x, y)) {
            lose(x, y, board);
            return;
        }
        // 最後に勝利判定処理
        if (checkWin(board)) {
            win(board)
        }
    }
}

/**
 * 地雷版を左クリックした時の処理。
 * 初回クリック時に、地雷版の初期化を行い地雷設置を呼び出す。
 * （初回クリックは必ず空白マスにしたいので、初回クリック時に初期化。）
 * @param eventX クリック時のx座標軸
 * @param eventY クリック時のy座標軸 
 * @param board  Board
 * @returns 
 */
export function leftClick(eventX: number, eventY: number, board: Board) {
    // 座用軸を添え字に変換
    const [x, y] = getPos(eventX, eventY, board.offsetLeft, board.offsetTop);
    // 地雷版の枠外なら何もしない
    if (!board.isIn(x, y)) return;
    // 地雷版が初期化されていない場合、初期化
    if (!board.isGroundSet) {
        board.initGround(x, y);
    }
    // クリックしたマスを開く
    openTile(x, y, board);
}

/**
 * 地雷版を右クリックした時の処理。
 * 開いていないマスなら旗を立てる。旗が既に立っていれば、旗をはずす。
 * @param eventX クリック時のx座標軸
 * @param eventY クリック時のy座標軸 
 * @param board  Board
 * @returns 
 */
export function rightClick(eventX: number, eventY: number, board: Board) {
    const [x, y] = getPos(eventX, eventY, board.offsetLeft, board.offsetTop);
    if (!board.isIn(x, y)) return;

    if (board.isCovered(x, y)) {
        // 開いていないなら旗を立てる
        board.setTileState(x, y, FLAGGED);
        board.guessed(-1);
    } else if (board.isFlagged(x, y)) {
        // 既に旗が経っていれば外す
        board.setTileState(x, y, NOT_OPEN);
        board.guessed(1);
    }
    // 旗を立てたタイミングで勝ちが確定することもあるので、勝利判定する。
    if (checkWin(board)) {
        win(board)
    }
}

/**
 * 数字マスをダブルクリックした時、隣接する開いていないマスを全て開く処理
 * 旗が立っているマスは除外
 * @param eventX クリック時のx座標軸
 * @param eventY クリック時のy座標軸 
 * @param board  Board
 * @returns 
 */
export function doubleClick(eventX: number, eventY: number, board: Board) {
    const [x, y] = getPos(eventX, eventY, board.offsetLeft, board.offsetTop);
    if (!board.isIn(x, y)) return;
    if (board.isOpen(x, y) && board.isNumber(x, y)) {
        // 数字マスなら隣接する開いていないマスを全て開く
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

/**
 * smiley faceにマウスダウンした時、画像を切り替える処理
 * クリックした座標軸が、smiley faceの枠内ならtrue,枠外ならfalseを返す
 * @param eventX クリック時のx座標軸
 * @param eventY クリック時のy座標軸 
 * @param board  Board
 * @returns boolean
 */
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

/**
 * smiley faceにマウスアップした時、画像を切り替える処理
 * クリックした座標軸が、smiley faceの枠内ならtrue,枠外ならfalseを返す
 * @param eventX クリック時のx座標軸
 * @param eventY クリック時のy座標軸 
 * @param board  Board
 * @returns boolean
 */
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


/**
 * 経過秒数を描写するための関数を返す関数
 * @param img spriteを読み込んだimgタグ
 * @param ctx canvas 2d rendering context
 * @param board Board
 * @returns 時間を描写する関数
 */
export function scheduleTick(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    // 秒数を更新し、情報版の経過秒数部分のみを描写する関数
    // 呼び出しもとで1秒間隔でsetIntervalする想定
    const fn = () => {
        board.tick();
        clearTime(ctx, board);
        renderTime(img, ctx, board);
    };
    return fn;
}

/**
 * 負けた時に呼び出す関数。
 *  - クリックした地雷を赤地雷spriteに差し替える
 *  - 撤去されていない地雷を表示
 *  - 間違えて旗を立てたマスをバッテンspriteに差し替える
 * @param eventX クリック時のx座標軸
 * @param eventY クリック時のy座標軸 
 * @param board  Board
 */
function lose(x: number, y: number, board: Board) {
    // smiley faceを負け顔に
    board.setSmileState(SMILE_LOSE);
    // game状態を負けに
    board.setGameState(LOSE);
    // クリックした地雷を赤spriteに
    board.setGroundState(x, y, RED_BOMB);

    const { tiles, ground, rows, cols } = board;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const ti = tiles[r][c];
            const gr = ground[r][c];
            if (ti === NOT_OPEN && gr === BOMB) {
                tiles[r][c] = OPEN;
            } else if (ti === FLAGGED && gr !== BOMB) {
                tiles[r][c] = OPEN;
                ground[r][c] = NG_BOMB;
            }

        }
    }
}

/**
 * 勝利判定処理  
 * 地雷以外のマスが全て開かれており、旗の数と設置地雷数が一致していればWIN!
 * @param board 
 * @returns boolean 勝利ならtrue
 */
function checkWin(board: Board) {
    const { rows, cols, bombs, tiles, ground } = board;
    let cnt = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const ti = tiles[r][c];
            const gr = ground[r][c];
            // 開けていないtileがある場合はNG;
            if (ti === NOT_OPEN) return false;
            if (ti === FLAGGED) {
                if (gr === BOMB) {
                    cnt++;
                } else {
                    // bombじゃない場所にflagがたっていたらNG
                    return false;
                }
            }
        }
    }
    return cnt === bombs;
}

// 勝利した時に呼び出す処理
function win(board: Board) {
    // smiley faceをグラサンに
    board.setSmileState(SMILE_WIN);
    // ゲーム状態を勝ちに
    board.setGameState(WIN);
}

// ゲーム版クラス
export class Board {
    tiles: number[][];    // 地面を覆ってるマス
    ground: number[][];   // 地面のマス。爆弾か数字か空白
    isGroundSet: boolean; // 地面が設定されているかのフラグ
    smileState: number;   // smiley faceの状態
    gameState: number;    // gameの状態
    time: number;         // 最初のクリックからの経過秒数:0～999
    timerID: number;      // setIntervalのidだけど、使ってない！
    cols: number;         // tiles,groundの列数
    rows: number;         // tiles,groundの行数
    width: number;        // ゲーム版全体の幅
    height: number;       // ゲーム版全体の高さ
    guess: number;        // 残地雷数（地雷数-旗の数）
    bombs: number;        // 爆弾数:0～9
    /*offsetは座標軸からtilesの添え字に変換するために必要*/
    offsetTop: number;    // 地雷版の上からのoffset
    offsetLeft: number;   // 地雷版の左からのoffset

    /**
     * コンストラクタ
     * @param cols 地雷版の列数
     * @param rows 地雷版の行数
     * @param cols 地雷数
     */
    constructor({ cols, rows, bombs }: { cols: number, rows: number, bombs: number }) {

        this.tiles = [];
        this.ground = [];
        this.isGroundSet = false;
        this.smileState = SMILE;
        this.gameState = PLAY;
        this.bombs = bombs;
        this.cols = cols;
        this.rows = rows;

        // ゲーム版全体の幅と高さを設定
        this.width = cols * TILE_SIZE[0] + OFFSET_LEFT * 2;
        this.height = rows * TILE_SIZE[1] + OFFSET_TOP + MARGIN_BOTTOM * 2;

        // 残地雷数を爆弾数で初期化
        this.guess = bombs;

        this.time = 0;
        this.timerID = 0;

        // 地雷版のオフセット
        this.offsetTop = OFFSET_TOP + MARGIN_BOTTOM;
        this.offsetLeft = OFFSET_LEFT;

        // tilesとgroundを初期値で初期化
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
        this.smileState = state;
    }

    setTileState(x: number, y: number, state: number) {
        this.tiles[y][x] = state;
    }

    setGameState(state: number) {
        this.gameState = state;
    }

    setGroundState(x: number, y: number, state: number) {
        this.ground[y][x] = state;
    }

    // 右クリックでbomb予想数を±1する
    guessed(val: number) {
        this.guess += val;
    }

    // 時間更新
    tick() {
        if (this.time >= 1000 || !this.isGroundSet || this.gameState !== PLAY) {
            // 1000以上、地雷設置されていない（まだ最初のクリックしてない）,
            // もしくは負け状態、勝ち状態の時は時間更新しない
            return;
        }
        this.time += 1;
    }

    setTimer(tid: number) {
        this.timerID = tid;
    }

    // clicked x, clicked y
    /**
     * 地雷設置処理。最初のクリックで呼び出す。
     * （最初のクリックを空白マスにするため）
     * @param cx クリックされたx添え字:列数に該当
     * @param cy クリックされたy添え字:行数に該当
     */
    initGround(cx: number, cy: number) {
        const rows = this.rows;
        const cols = this.cols;
        const maxlen = rows * cols;

        // bombをセットする候補の添え字を格納。１次元配列として扱う。
        // まずは全ての添え字を候補としてセット。
        const bIndices = [];
        for (let i = 0; i < maxlen; i++) {
            bIndices.push(i);
        }

        // クリックしたマスが空白にするために、
        // clickされたマスとその隣接マスを候補から除外
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const nx = cx + c;
                const ny = cy + r;
                if (!this.isIn(nx, ny)) {
                    continue;
                }
                // ２二次元配列の行列のindexを１次元のindexに変換の上候補から除外
                const delVal = ny * cols + nx;
                const delIndex = bIndices.indexOf(delVal);
                bIndices.splice(delIndex, 1);
            }
        }

        // 地雷数分ランダムに候補を抽出
        // bIndicesには候補となる1次元添え字が入っているので、
        // 0 <= rnd <biIndices.lengthの範囲でランダムに地雷数分抽出
        for (let i = 0; i < this.bombs; i++) {
            // 地雷の数だけ、候補配列の長さの範囲で乱数生成
            // 乱数なのでfloat
            const rval = Math.random() * bIndices.length;
            // 添え字として扱えるように小数点切り捨て
            const rIndex = Math.floor(rval);

            // 乱数を添え字にして、候補の添え字を取得
            const bombIndex = bIndices[rIndex];

            // 1次元配列を二次元は利悦に変換
            const bx = bombIndex % cols;
            const by = Math.floor(bombIndex / cols);

            // 抽出した位置に地雷設置
            this.ground[by][bx] = BOMB;

            // 選ばれた要素がまた選ばれないように候補から落とす。
            bIndices.splice(rIndex, 1);
        }

        // bombの隣接マスに数字をセット
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
                        // 隣接マスの添え字を計算
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
            // 地雷設置フラグをtrueに
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

    // tiles,gorundの座標軸(x,y)から描写するspriteのインデックスを取得する
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



/**
 * ゲーム版の全描写
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
export function render(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    ctx.clearRect(0, 0, board.width, board.height);
    renderTime(img, ctx, board);
    renderGuess(img, ctx, board);
    renderSmile(img, ctx, board);
    renderTile(img, ctx, board);
    renderFrame(img, ctx, board);
    renderInfoFrame(img, ctx, board);
}

/**
 * 残地雷数のみの描写
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
function renderGuess(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    let val = board.guess;
    // 表示枠は3桁のため1000以上なら999を表示
    if (val >= 1000) {
        val = 999;
    }
    // －表示は非対応なので－ならゼロを表示。
    // 爆弾の数以上に旗を立てるとマイナスになることもありうる。
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

/**
 * 経過秒数のみの描写クリア
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
function clearTime(ctx: CanvasRenderingContext2D, board: Board) {
    const [w, h] = NUMS_SIZE;
    const ew = board.width - OFFSET_LEFT;
    ctx.clearRect(ew, OFFSET_TOP, ew + 3 * w, OFFSET_INFO_TOP);
}

/**
 * 経過秒数のみの描写
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
function renderTime(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    let val = board.time;
    // 経過秒数は３桁表示なので1000秒以上は999を表示
    if (val >= 1000) {
        val = 999;
    }
    // マイナスはありえないが一応
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


/**
 * smiley face部分のみをクリアして再描写する
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
export function changeSmile(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    clearSmile(ctx, board);
    renderSmile(img, ctx, board);
}

/**
 * smiley face部分のみをクリアする
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
function clearSmile(ctx: CanvasRenderingContext2D, board: Board) {
    const [w, h] = SMILE_SIZE;
    const sx = board.width / 2 - w / 2;
    const sy = OFFSET_INFO_TOP;
    ctx.clearRect(sx, sy, w, h);
}

/**
 * smiley face部分のみを描写
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
function renderSmile(img: HTMLImageElement, ctx: CanvasRenderingContext2D, board: Board) {
    const { cols, smileState: state } = board;
    const width = SMILE_SIZE[0];
    const canvasWidth = cols * TILE_SIZE[0] + OFFSET_LEFT * 2;
    const tile = SMILE_SP[state];
    const [posx, posy] = [canvasWidth / 2 - width / 2, OFFSET_INFO_TOP];
    ctx.drawImage(img, tile[0], tile[1], tile[2], tile[3], posx, posy, SMILE_SIZE[0], SMILE_SIZE[1]);
}

/**
 * 情報版の枠線を描写する
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
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

/**
 * 地雷版の枠線を描写
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
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

/**
 * 地雷版を描写する 
 * @param img spriteのimgタグ
 * @param ctx canvas 2d context
 * @param board Board
 */
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