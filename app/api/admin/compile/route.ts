/**
 * 手動ビルド。ボタン押下で発動。サーバー側のbuild.shを実行。
 * /adminで利用
 * エンドポイント： [POST] /api/admin/compile
 * ResponseのContent-Type: text/plain
 * TODO
 *  認証チェックは外出しを検討。
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdmin } from "../../../../lib/db/func";
import build from "../../../../lib/build";

export async function POST(req: NextRequest) {
    // 認証チェック。cookieに設定されたuser情報が正しくないと処理しない。
    const auth = cookies().get("user");
    if (!auth || !(await isAdmin(auth.value))) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "Content-Type": "text/plain" },
        });
    }

    // 認証OK！ビルドして終了
    const msg = await build();
    // msgが設定されている場合はエラー。
    if (msg.length > 0) {
        return new NextResponse(msg, {
            status: 500,
            headers: { "Content-Type": "text/plain" }
        })
    }

    return new NextResponse("build started!", {
        headers: { "Content-Type": "text/plain" },
    });
}