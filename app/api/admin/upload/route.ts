/**
 * /adminで使用。新ページ登録処理。
 * エンドポイント： [POST] /api/admin/upload
 * Request Body: Content-Type: multipart/form-data
 */

import path from "node:path";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdmin, deleteDuplicateDir, insertBlogInfo } from "../../../../lib/db/func";
import { getBlogMd, formatMd } from "../../../../lib/util";
import { backupAssetsCollection, findBlogDocs } from "../../../../lib/db/func";
import type { BlogInfo } from "../../../../types";


export async function POST(req: NextRequest) {
    /**認証チェック */
    // cookieを取得して認証チェック
    const cookie = cookies().get("user");
    if (!cookie || !(await isAdmin(cookie.value))) {
        return NextResponse.json({ msg: "Unauthorized user." }, { status: 401 })
    }

    /*処理に使うデータを分解。FormDataです。*/
    const formData = await req.formData();
    const dir = formData.get("dir") as string | null;
    const isForce = formData.get("isForce") as string | null;
    const files = formData.getAll("uploads") as File[] | null;
    const genre = formData.get("genre") as string;
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const thumb = formData.get("thumb") as string;
    const md = formData.get("md") as string;
    const keywords = formData.get("keywords") as string;

    /* folder作成*/
    if (dir === null || isForce === null) {
        return NextResponse.json({ msg: "Error: Request not properly set!" }, { status: 400 })
    }
    const root = path.resolve();
    const savePath = path.join(root, `public/posts/${dir}`)
    const isExists = existsSync(savePath);
    // フォルダが既に存在し、上書きモードでない場合はエラーにする
    if (isExists && isForce === "false") {
        return NextResponse.json({ msg: `${savePath} already exists!` }, { status: 500 });
    }
    // エラーなし。フォルダが存在しない場合は作成
    if (!isExists) {
        try {
            await mkdir(savePath);
        } catch (err: unknown) {
            console.log(err);
            return NextResponse.json({ msg: `Error: Could not make folder:${savePath}` }, { status: 500 })
        }
    } else {
        // 存在する場合。
        // 同じフォルダ名で登録されているドキュメントをDBから削除
        // 削除後に挿入するため、awaitする。
        await deleteDuplicateDir({ assetsDir: dir });
    }

    /**file保存 */
    if (files === null || savePath === null) {
        return NextResponse.json(
            { msg: "Error: Could not get uploadfiles" },
            { status: 400 }
        );
    }

    /**
     * .forEachがayncだと、promsにwriteFileのPromiseが設定される前に
     * 次のdb insertの処理が流れてしまう。.thenで繋げてなんとかする方式に変更
     */
    const proms: Promise<void>[] = [];
    files.forEach((file) => {
        const fpath = path.join(savePath, file.name);
        // const ab = await file.arrayBuffer();
        // const buf = Buffer.from(ab);
        // const prom = writeFile(fpath, buf, { encoding: "binary" });
        const prom = file.arrayBuffer()
            .then(ab => {
                const buf = Buffer.from(ab);
                return writeFile(fpath, buf, { encoding: "binary" });
            })
        proms.push(prom);
    });



    /***********************************
     * db insert
     * *********************************/

    // ファイルの保存が全て終わるのを待つ
    await Promise.all(proms)
    const info: BlogInfo = {
        genre: genre,
        assetsDir: dir,
        title: title,
        summary: summary,
        thumb: thumb,
        md: md,
        likes: 0,
        dislikes: 0,
        views: 0,
    };

    // 現在時刻を設定
    const now = new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" });
    // mdファイルの中身を抽出し、`postedDate`を初期投稿日として設定。
    const mdData = await getBlogMd(dir);
    // gray-matterでmdDataをyaml部分とそれ以外に分離
    const fmtData = formatMd(mdData);
    // 初期投稿日を取得
    const { postedDate } = fmtData.data;
    // 初期投稿日が設定されていない場合、現在時刻を設定
    const iniDate = postedDate ? new Date(postedDate).toLocaleString("ja", { timeZone: "Asia/Tokyo" }) : now;

    // 日付型に変換してDB登録
    info["posted"] = new Date(now);
    info["firstPostedDate"] = new Date(iniDate);
    info["keywords"] = JSON.parse(keywords);
    // insert後に更新版のブログを返したいので、待つ
    const result = await insertBlogInfo(info);
    if (!result.acknowledged) {
        return NextResponse.json(
            { msg: "Error: Insert DB failed. Try later!" },
            { status: 500 }
        )
    }

    /*****************
     * BackUp
     * ****************/
    const blogs = await findBlogDocs();
    backupAssetsCollection(blogs); // バックアップ
    const resData = { blogs, msg: "upload succeeded!" };
    return NextResponse.json(resData);
}