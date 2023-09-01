/**
 * /boardで使用
 * endpoint: [POST] /board/comment
 * フォームで入力したコメントをDBに挿入する。lineにも記入があったことを通知する。
 */

import { NextRequest, NextResponse } from "next/server";
import { insertNewComment } from "../../../../lib/db/func";
import notify from "../../../../lib/linenotify";
import type { PostBody } from "../../../board/Board";

export async function POST(req: NextRequest) {
    const comment = await req.json() as PostBody;
    try {
        await insertNewComment(comment);
        notify(comment.msg);
        return NextResponse.json(null, { status: 200, statusText: "Upload succeeded!" })
    } catch (err) {
        console.log(err);
        return NextResponse.json(null, { status: 500, statusText: "Could not upload comment. Try later!" })
    }
}