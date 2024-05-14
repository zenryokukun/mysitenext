import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdmin } from "../../../../lib/db/admin";
import { getTutorials } from "../../../../lib/db/sqlite-query-tutorial";

export async function GET(req: NextRequest) {
    // 管理者チェック
    const auth = cookies().get("user");
    if (!auth || !(await isAdmin(auth.value))) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: { "Content-Type": "text/plain" },
        });
    }

    try {
        const recs = await getTutorials();
        return NextResponse.json(recs);
    } catch (err) {
        console.log(err);
        return NextResponse.json("could not fetch tutorial data from db.", {
            status: 500,
        })
    }

}