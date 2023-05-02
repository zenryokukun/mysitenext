/**
 * 手動ビルド。ボタン押下で発動。サーバー側のbuild.shを実行。
 * TODO
 *  認証チェックは外出しを検討。`upload`エンドポイントでも実装したほうが良い。
 */

import { isAdmin } from "../../../lib/db/func";
import build from "../../../lib/build";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // methodチェック
    if (req.method !== "POST") {
        return res.status(405).send("Wrong method!")
    }

    // 認証チェック。cookieに設定されたuser情報が正しくないと処理しない。
    // userを取得
    const { user } = req.cookies;

    // userが設定されていなければ処理しない
    if (!user) {
        return res.status(401).send("unauthorized");
    }

    // user認証チェック
    const allow = await isAdmin(user);

    // 認証されなければ処理しない
    if (!allow) {
        return res.status(401).send("unauthorized");
    }

    // 認証OK！ビルドして終了
    build();
    res.status(200).send("build started!");
}