import { mkdir } from "fs/promises";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

interface Status {
    status: number,
    data: string,
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// pythonスクリプトのフルパス
const PYSCRIPT = path.join(__dirname, "src", "main.py");

function formatDigit(num: number): string {
    if (num < 10) {
        return '0' + num.toString();
    }
    return num.toString();
}

function formattedDate(): string {
    const d = new Date();
    const year = d.getFullYear().toString();
    const month = formatDigit(d.getMonth() + 1);
    const date = formatDigit(d.getDate());
    const hour = formatDigit(d.getHours());
    const min = formatDigit(d.getMinutes());
    const sec = formatDigit(d.getSeconds());
    return year + month + date + "_" + hour + min + sec;
}

/**
 * root直下にフォルダを作る関数。フォルダ名はYYYYMMDD_HHMMSS。
 * @param root フォルダを作成する場所
 * @returns Promise<{status:number,data:string}>
 */
export async function makeFolder(root: string): Promise<Status> {
    const folname = formattedDate();
    const targDir = path.join(root, folname);
    try {
        await mkdir(targDir);
        return { status: 0, data: targDir };
    } catch (err) {
        return { status: 1, data: `failed to make folder :${targDir}` };
    }
}

/**
 * targDirに入っている画像に対して./src/main.pyを呼び出し、targDirごとzip化。
 * @param targDir 処理対処のフォルダのフルパス
 * @param ratio 縦横比
 * @param resize "custom" | "default"
 * @param width "custom"の時に指定する。拡大or縮小後の横幅ピクセル数
 * @returns Promise<number>
 */
export function zipFiles(targDir: string, ratio: string, resize: string, width: string) {
    // python scriptをcommand line arguments付きで呼び出す
    const pycmd = process.env.NODE_ENV === "production" ? "python3" : "python";
    const py = spawn(pycmd, [PYSCRIPT, targDir, ratio, resize, width]);
    // pythonの出力があればnodeのコンソールに出力
    py.stdout.on("data", data => console.log(data.toString()));
    py.stderr.on("data", data => console.log(data.toString()));

    // python処理が終わった時にresolveするプロミス。spawnを同期するため。
    const p = new Promise((res, rej) => {
        py.on("close", data => {
            res(data);
        })
    });
    return p;
}