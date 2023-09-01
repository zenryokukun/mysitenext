import { NextRequest, NextResponse } from "next/server";
import { updateLike } from "../../../../lib/db/func";

// GETの時、cacheを無効化し、リクエストの都度処理が流れるようにしたい場合コメントアウト。
// 滅多にリクエストが来ないので、当面無効え良い。POSTはcacheなし。常にdynamic。
// export const revalidate = 0;

interface Body {
    dir: string;
}

export async function POST(req: NextRequest) {

    // bodyを取得
    const body: Body = await req.json();

    // production以外の場合は何もしない。status400だけ返す。
    // 開発環境の場合はここに流れる。
    if (process.env["NODE_ENV"] !== "production") {
        console.log("yoyoyoyo")
        return NextResponse.json(null, { status: 400, statusText: "Not in PRODUCTION!" });
    }

    // body.dirが何も指定されていない場合はエラー。
    // クライアント側のfetchの仕方が想定外
    if (!body.dir) {
        return NextResponse.json(null, { status: 400, statusText: "Property `dir` was null." });
    }

    // dbをアップデート
    const result = await updateLike(body);

    // アップデート失敗
    if (!result) {
        return NextResponse.json(null, { status: 400, statusText: "Update failed. Try later." })
    }

    // 正常終了。statusTextはなし！
    return NextResponse.json(null, { status: 200 })
}