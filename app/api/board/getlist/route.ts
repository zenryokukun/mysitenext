/**
 * /boardで利用。
 * endpoint: [GET] /board/getlist
 * コメント一覧を取得。上限1000。
 * [TODO] コメントが多くなってきたらトピックのみ抽出し、
 * トピックをクリックしたら傘下のコメントを取得するように変更する。
 */

import { NextRequest, NextResponse } from "next/server";
import { getNewComments } from "../../../../lib/db/sqlite-query-comments";

// cache無効化。リクエスト毎に実行。サーバのメモリが少ないのと、
// そこまで実行頻度が高くないため。
export const revalidate = 0;

export async function GET(req: NextRequest) {
    try {
        const docs = await getNewComments(1000);
        return NextResponse.json(docs);
    } catch (err) {
        console.log(err);
        return NextResponse.json(null, { status: 400, statusText: "Error: Could not retrieve comments." })
    }
}
