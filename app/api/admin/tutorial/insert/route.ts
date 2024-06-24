import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import extract from "../extract-form";
import { isAdmin } from "../../../../../lib/db/admin";
import { insertTutorial } from "../../../../../lib/db/sqlite-query-tutorial";

export async function POST(req: NextRequest) {
    // 管理者チェック
    const auth = cookies().get("user");
    if (!auth || !(await isAdmin(auth.value))) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "Content-Type": "text/plain" },
        });
    }

    const fd = await req.formData();
    const cols = extract(fd);
    const result = await insertTutorial(cols);
    const msg = result.acknowledged ? "挿入は成功です☆" : "挿入に失敗しました...";
    const resp = new NextResponse(msg, {
        status: 200,
        // charsetが無いとブラウザで文字化けするため、明示。
        headers: { "Content-Type": "text/plain; charset=UTF-8" }
    });
    if (result.acknowledged) {
        revalidatePath("/tutorial");
    }
    return resp;
}