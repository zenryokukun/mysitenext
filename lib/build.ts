/**
 * アップロード後、npx next buildする関数。/api/admin のアップロード処理で呼び出す
 * ./build.sh　を実行するので、このファイルと同じ階層に置いておくこと。
 */

import { spawn } from "child_process";

export default async function build(): Promise<string> {
    if (process.env.NODE_ENV !== "production") {
        const msg = `Not building! You're on dev mode.NODE_ENV:${process.env.NODE_ENV}`;
        console.log(msg);
        return msg;
    }
    const cmd = "./build.sh";
    const proc = spawn(cmd);
    proc.stdout.on("data", data => console.log(data.toString()));
    proc.stderr.on("data", data => console.log(data.toString()));
    proc.on("close", data => console.log(data));
    return "";
}