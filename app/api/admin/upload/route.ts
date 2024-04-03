/**
 * /adminで使用。新ページ登録処理。
 * エンドポイント： [POST] /api/admin/upload
 * Request Body: Content-Type: multipart/form-data
 * 
 * アップロードファイルをサーバに保存し、記事情報をDBに登録する。
 * 
 * md,mdxともにアップロードファイルは/public/posts/記事名に保存する。
 * mdxの場合、アップロードファイルが無い場合もある。無い場合でも、フォルダは作成する
 * （誤って消さないように空テキストを置いておく）
 * 
 */

import path from "node:path";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdmin } from "../../../../lib/db/admin";
import {
    deleteDuplicateDir, insertBlogInfo, findByField, updateMDXBlogInfo,
    backupAssetsCollection, findBlogDocs
} from "../../../../lib/db/sqlite-query-assets";
import cast from "../assetsRecToBlogInfo";
import { getBlogMd, formatMd } from "../../../../lib/util";
import type { BlogInfo } from "../../../../types";


export async function POST(req: NextRequest) {

    /**認証チェック */
    // cookieを取得して認証チェック
    const cookie = cookies().get("user");
    if (!cookie || !(await isAdmin(cookie.value))) {
        return NextResponse.json({ msg: "Unauthorized user." }, { status: 401 })
    }

    /**
     * 処理に使うデータを分解。FormDataです。 
     * [TODO]
     *  filesはgetAllしているので、存在しない場合はnullでなく空リストを返す。
     * 型変更し、filesのnullチェックを削除することを検討。files.length === 0で確認すべし。
     */
    const formData = await req.formData();
    const dir = formData.get("dir") as string;
    const isForce = formData.get("isForce") as string | null;
    const isMDX = formData.get("isMDX") as string | null;
    const files = formData.getAll("uploads") as File[] | null;
    const genre = formData.get("genre") as string;
    const title = formData.get("title") as string;
    const summary = formData.get("summary") as string;
    const thumb = formData.get("thumb") as string;
    const md = formData.get("md") as string;
    const keywords = formData.get("keywords") as string;

    // 必須項目が取れていなかったらエラー
    if (dir === null || isForce === null || isMDX === null) {
        return NextResponse.json({ msg: "Error: Request not properly set!" }, { status: 400 })
    }

    /*************************************************
     * フォルダ作成処理。MD,MDX問わず作成。
     * MDXの場合、アップロードファイルが無くても作成。
     *************************************************/
    const root = path.resolve();
    const savePath = path.join(root, `public/posts/${dir}`)
    const isExists = existsSync(savePath);

    // 保存パスが設定できなかった場合はエラー
    if (savePath === null) {
        return NextResponse.json(
            { msg: "Error: Could not relove path: " + dir },
            { status: 400 }
        );
    }

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
        // 同じフォルダ名で登録されているドキュメントをDBから削除。削除後に挿入するため、awaitする。
        // mdxの場合は更新処理を実装（初回登録日をmdから取得できないため）してあるので、mdの場合のみ削除。
        if (isMDX === "false") {
            await deleteDuplicateDir({ assetsDir: dir });
        }
    }

    /********************************************
     * file保存処理。
     ********************************************/
    // MDXでアップロードファイルが無い場合、空ファイルをセット語、専用DB登録処理に進む
    // アップロードが無い場合、formDataの"uploads"(files)はnullのはずなんだが、何故か空リストになる、、、
    // --> 解決！。formData.getだと、存在しないkeyだとnullを返すが、.getAllだと空リストを返すため。
    // なのでfilesはnullにはなり得ない。上でtypeを変えることも検討。。。
    if (isMDX === "true" && (files === null || files.length === 0)) {
        emptyFile(savePath);
        return uploadMDX(genre, dir, title, summary, thumb, keywords);
    }

    // mdの場合、もしくはmdxでアップロードファイルがある場合。
    // ファイルがなければエラー
    if (files === null) {
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

    // MDXの場合、専用DB登録処理を呼んでreturn
    if (isMDX === "true") {
        return uploadMDX(genre, dir, title, summary, thumb, keywords);
    }

    // MDの場合
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
    const nowStr = new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" });
    // mdファイルの中身を抽出し、`postedDate`を初期投稿日として設定。
    const mdData = await getBlogMd(dir);
    // gray-matterでmdDataをyaml部分とそれ以外に分離
    const fmtData = formatMd(mdData);
    // 初期投稿日を取得
    const { postedDate } = fmtData.data;
    // 初期投稿日が設定されていない場合、現在時刻を設定
    const firstPostedStr = postedDate ? new Date(postedDate).toLocaleString("ja", { timeZone: "Asia/Tokyo" }) : nowStr;

    // 日付型に変換してDB登録
    info["posted"] = nowStr;
    info["firstPostedDate"] = firstPostedStr;
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
    backupAssetsCollection(); // バックアップ
    const recs = await findBlogDocs();
    const blogs = recs.map(rec => cast(rec));
    const resData = { blogs, msg: "upload succeeded!" };
    return NextResponse.json(resData);
}


/**
 * mdx用のアップロード処理。
 * @param genre string
 * @param dir string
 * @param title string
 * @param summary string
 * @param thumb string
 * @param keywords string
 * @returns 
 */
async function uploadMDX(
    genre: string,
    dir: string,
    title: string,
    summary: string,
    thumb: string,
    keywords: string,
) {
    // AssetsテーブルのDIR = dirのドキュメントが登録済みかチェックする。
    // 未登録ならinsert、登録済ならupdateする。
    const oldBlogs = await findByField("DIR", dir);
    let exists: boolean;
    if (!oldBlogs) {
        exists = false;
    } else {
        exists = true;
    }

    // 現在時刻（日本時間）をDate型に。登録日として使う。
    // 結局最後のnew Date(nowString)でUTCになるので、間違っているんだけど、、、既存の処理あわせる。
    const nowString = new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" });
    // const now = new Date(nowString);

    if (!exists) {
        // 初回登録。挿入。
        // クライアント側でもmd:"page.mdx"に固定しているが、変えられた場合も想定してここでも固定しておく。
        const blog: BlogInfo = {
            genre: genre,
            assetsDir: dir,
            title: title,
            summary: summary,
            thumb: thumb,
            md: "page.mdx",
            likes: 0, dislikes: 0, views: 0,
            posted: nowString,
            firstPostedDate: nowString,
            keywords: JSON.parse(keywords),
        }

        const result = await insertBlogInfo(blog);

        if (!result.acknowledged) {
            return NextResponse.json(
                { msg: "Error: Insert DB failed. Try later!" },
                { status: 500 }
            )
        }

    } else {

        // 既存登録あり。更新。likes,dislikes,views等、管理画面から変更できない値は更新しない。
        const blog = {
            genre: genre,
            title: title,
            summary: summary,
            thumb: thumb,
            // client側で未入力は[]にしている。
            keywords: JSON.parse(keywords) as string[],
            posted: nowString,
        }

        const result = await updateMDXBlogInfo({ assetsDir: dir }, blog);

        if (!result.acknowledged) {
            return NextResponse.json(
                { msg: "Error: UUpdate DB failed. Try later!" },
                { status: 500 }
            )
        }
    }

    /*****************
    * BackUp 
    * ****************/
    backupAssetsCollection(); // バックアップ
    /**
     * return fresh data
     */
    const recs = await findBlogDocs();
    const blogs = recs.map(rec => cast(rec));
    const resData = { blogs, msg: "upload succeeded!" };
    return NextResponse.json(resData);

}


// 空ファイル作成用
function emptyFile(savepath: string) {

    const fullpath = path.join(savepath, "readme.txt")
    console.log(fullpath)
    const msg = "This page was uploaded with no files. This page should be generated with .mdx file. \
    To keep consistency, do not delete this folder."

    writeFile(fullpath, msg, { "encoding": "utf-8" })
}