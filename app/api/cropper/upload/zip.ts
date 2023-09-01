/**
 * /app/api/route内で利用。
 * Route Handlers移行に伴って、/pages/api/cropper/helperから移植。
 * 移植元のhelper.jsは全て移行済。折を見て削除。
 * パラメタで受け取ったファイルをzip圧縮するpythonのコードを呼び出す。
 */

import path from "node:path";
import { spawn } from "node:child_process";
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
    const pyscript = path.join(path.resolve(), "py", "main.py");
    const py = spawn(pycmd, [pyscript, targDir, ratio, resize, width]);
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