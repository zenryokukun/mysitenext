/**
 * /adminページで利用。ジャンル一覧を取得。
 * エンドポイント: [GET] /api/admin/genre
 */

import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

// cache無効化。管理画面でしか使わないし。
export const revalidate = 0;

export async function GET() {
    // genre一覧ファイルのパス
    const fpath = path.join(path.resolve(), "data", "genre.json");
    try {
        const content = await readFile(fpath, { encoding: "utf-8" });
        const body = JSON.parse(content);
        return NextResponse.json(body, { status: 200 });
    } catch (err) {
        console.log(err);
    }

    // ここまで来てしまったらエラー。。。
    return NextResponse.json(null, { status: 500 })
}