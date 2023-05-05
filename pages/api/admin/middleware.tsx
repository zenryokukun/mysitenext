
import type { NextApiRequest, NextApiResponse } from "next";
import type { BlogInfo } from "../../../types";
import { deleteDuplicateDir, insertBlogInfo } from "../../../lib/db/func";
import { isAdmin } from "../../../lib/db/func";
import { getBlogMd, formatMd } from "../../../lib/util";
import multer from "multer";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";


type CustomRequest = NextApiRequest & {
    files: Express.Multer.File[],
    savePath: string,
}


// クライアントのform inputのname
const FORM_NAME = "uploads";
// 複数ファイルのアップロードに対応したmiddleware.
// req.filesに配列で設定ｓあれる
const multiUploader = multer().array(FORM_NAME);

/**
 * request.cookies.userを認証する。認証failなら40Xステータスを返す。
 * 認証OKなら次のmiddlewareを呼ぶ。
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @param next 次のmiddlewareを呼ぶ
 * @returns void
 */
async function checkUser(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    // 認証チェック。cookieに設定されたuser情報が正しくないと処理しない。
    // userを取得
    const { user } = req.cookies;

    // userが設定されていなければ処理しない
    if (!user) {
        return res.status(401).send("unauthorized");
    }

    // user認証チェック
    const allow = await isAdmin(user);

    // 認証されなければ処理しない
    if (!allow) {
        return res.status(401).send("unauthorized");
    }

    // 認証OK。次のmiddlewareへ。
    next();
}

/**
 * formで入力したdirの名前で、/public/postsにフォルダを作成。  
 * reqにそのパスを設定
 * @param req CustomRequest files[]とsavePathを追加
 * @param res NextApiResponse
 * @param next 次のmiddlewareを実行
 * @returns void
 */
async function makeFolder(req: CustomRequest, res: NextApiResponse, next: () => void) {
    if (req.method !== "POST") {
        return res.status(405).send("wrong method");
    }
    const { dir, isForce } = req.body;
    const root = path.resolve()
    const savePath = path.join(root, `public/posts/${dir}`);

    const isExists = existsSync(savePath);
    // フォルダが既に存在し、上書きモードでない場合はエラーにする
    if (isExists && isForce === "false") {
        return res.status(500).send(`${savePath} already exists!`);
    }
    // エラーなし。フォルダが存在しない場合は作成
    req.savePath = savePath;
    if (!isExists) {
        try {
            await mkdir(savePath);
            next();
        } catch (err: unknown) {
            console.log(err);
            res.status(400).send("Something went wrong... Try later!")
        }
    } else {
        // 存在する場合。
        // 同じフォルダ名で登録されているドキュメントをDBから削除
        // 削除後に挿入するため、awaitする。
        await deleteDuplicateDir({ assetsDir: dir });
        next();
    }
}

/**
 * makeFolderの次に呼ぶ。  
 * makeFolderで作成したフォルダーに、req.filesをファイルとして保存する。
 * @param req CustomRequest files[]とsavePathを追加
 * @param res NextApiResponse
 * @param next 次のmiddlewareを実行
 * @returns void
 */
async function saveFiles(req: CustomRequest, res: NextApiResponse, next: () => void) {
    if (req.files === null || req.savePath === null) {
        return res.status(400).send("Something went wrong... Try later!")
    }
    const proms: Promise<void>[] = [];
    req.files.forEach(async (file) => {
        const fpath = path.join(req.savePath, file.originalname)
        try {
            const p = writeFile(fpath, file.buffer, { encoding: "binary" });
            proms.push(p);
        } catch (err) {
            console.log(err);
            res.status(400).send("Something went wrong... Try later!")
        }
    });
    // ファイルの保存がすべて完了したら次のmiddlewareに。
    await Promise.all(proms).then(() => next());
}


async function insertDB(req: NextApiRequest, res: NextApiResponse, next: () => void) {
    const { genre, dir, title, summary, thumb, md, keywords } = req.body
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
    }

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
        // insertが失敗した場合はclientにエラーメッセージを返す。
        return res.status(500).send("something went wrong...Try later!");
    }
    next();
}
export { checkUser, multiUploader, makeFolder, saveFiles, insertDB }