/**
 * アップロード後、npx next buildする関数。/api/admin のアップロード処理で呼び出す
 * ./build.sh　を実行するので、このファイルと同じ階層に置いておくこと。
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

export default async function build(): Promise<string> {
    if (process.env.NODE_ENV !== "production") {
        const msg = `Not building! You're on dev mode.NODE_ENV:${process.env.NODE_ENV}`;
        console.log(msg);
        return msg;
    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const shell = "build.sh";
    const cmd = "./" + path.join(__dirname, shell);
    const proc = spawn(cmd);
    proc.stdout.on("data", data => console.log(data.toString()));
    proc.stderr.on("data", data => console.log(data.toString()));
    proc.on("close", data => console.log(data));
    return "";
}

export async function buildTest() {
    if (process.env.NODE_ENV !== "production") {
        const msg = `Not building! You're on dev mode.NODE_ENV:${process.env.NODE_ENV}`;
        console.log(msg);
        return msg;
    }
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const shell = "buildtest.sh";
    const cmd = path.join(__dirname, shell);
    console.log(cmd);
    const proc = spawn(cmd);
    proc.stdout.on("data", data => console.log(data.toString()));
    proc.stderr.on("data", data => console.log(data.toString()));
    proc.on("close", data => console.log(data));
    return "";
}