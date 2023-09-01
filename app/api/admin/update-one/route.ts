/**
 * /adminで使用。登録済の記事項目の更新処理
 * エンドポイント： [POST] /api/admin/update-one
 * Request Body: Content-Type: application/json
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdmin, updateBlogInfo, findBlogDocs } from "../../../../lib/db/func";
import type { UpdateItemRequest } from "../../../../types";


export async function POST(req: NextRequest) {

    const auth = cookies().get("user");

    // 管理者じゃなければエラー
    if (!auth || !(await isAdmin(auth.value))) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "Content-Type": "text/plain" },
        })
    }

    // UpdateItemRequestには更新キーと更新データが入ってる。
    const body: UpdateItemRequest = await req.json();

    // db更新処理。
    const result = await updateBlogInfo(body);
    if (!result.acknowledged) {
        return new NextResponse("Error: Could not insert DB. Try later!", {
            status: 500,
            headers: { "Content-Type": "text/plain" },
        })
    }

    // 新しいブログのリストをクライアントに返す。
    const blogs = await findBlogDocs();
    const resData = { blogs, msg: "upload succeeded!" };
    return NextResponse.json(resData);

}