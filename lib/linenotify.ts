import { readFile } from "node:fs/promises";
import path from "node:path";
import fetch from "node-fetch";

export default async function notify(msg: string) {

    // 認証ファイルからurlとtoken取得
    const root = path.resolve();
    const credPath = path.join(root, "lib/cred/line-notify.json");
    const file = await readFile(credPath, { encoding: "utf-8" });
    const cred = JSON.parse(file);
    const url = cred.url;
    const token = cred.token;

    // 現在日付
    const now = new Date().toLocaleString();

    // body部分。content-typeがx-www-form-urlencoded。
    // formのデータ形式はクエリ文字列と同じようなので、URLSearchParamを使う
    const dataObj = {
        "message": now + "\n\n" + msg,
        "stickerPackageID": "446",
        "stickerID": "1988",
    }
    const data = new URLSearchParams(dataObj);
    const body = data.toString();

    // 実行
    fetch(url, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body,
    }).then(res => {
        if (!res.ok) {
            console.log(res.statusText)
        }
    })
}