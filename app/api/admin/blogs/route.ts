/**
 * /adminで使う。カスタムフックuseBlogsで使っている。
 * エンドポイント：　[GET] /api/admin/blogs
 */

import { NextResponse } from "next/server";
import { findBlogDocs } from "../../../../lib/db/sqlite-query-assets";
import cast from "../assetsRecToBlogInfo";

// cache無効化
export const revalidate = 0;

export async function GET() {
    try {
        // AssetsRec型
        const recs = await findBlogDocs(999);
        // AssetsRec -> BlogInfo型に変換
        const docs = recs.map(rec => cast(rec));
        return NextResponse.json(docs);
    } catch (err) {
        console.log(err);
        return new NextResponse("Could not fetch blogs!", { status: 500 })
    }
}