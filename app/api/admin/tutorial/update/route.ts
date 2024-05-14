import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import extract from "../extract-form";
import { isAdmin } from "../../../../../lib/db/admin";
import { updateTutorial } from "../../../../../lib/db/sqlite-query-tutorial";

export async function POST(req: NextRequest) {
    // 管理者チェック
    const auth = cookies().get("user");
    if (!auth || !(await isAdmin(auth.value))) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "Content-Type": "text/plain" },
        });
    }
    // formDataを抽出し、DBを更新。
    const fd = await req.formData();
    const cols = extract(fd);
    // db登録値のslugsを追加
    const dbslugs = fd.get("dbslugs") as string;
    const updateCols = { ...cols, DBSLUGS: dbslugs };
    const result = await updateTutorial(updateCols);

    let msg = `「${cols.TITLE}」"の`;
    msg += result.acknowledged ? "更新は成功です☆" : "更新に失敗しました...";
    return new NextResponse(msg, {
        status: 200,
        // charsetが無いとブラウザで文字化けするため、明示。
        headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
}