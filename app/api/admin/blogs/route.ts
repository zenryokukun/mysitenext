/**
 * /adminで使う。カスタムフックuseBlogsで使っている。
 * エンドポイント：　[GET] /api/admin/blogs
 */

import { NextRequest, NextResponse } from "next/server";
import { findBlogDocs } from "../../../../lib/db/func";

// cache無効化
export const revalidate = 0;

export async function GET() {
    try {
        const docs = await findBlogDocs(999);
        return NextResponse.json(docs);
    } catch (err) {
        console.log(err);
        return new NextResponse("Could not fetch blogs!", { status: 500 })
    }
}