
import type { NextApiRequest, NextApiResponse } from "next";
import type { BlogInfo } from "../../../types";
import multer from "multer";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { deleteDuplicateDir, insertBlogInfo } from "../../../lib/db/func";

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
        //　同じフォルダ名で登録されているドキュメントをDBから削除
        deleteDuplicateDir({ assetsDir: dir });
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
    const { genre, dir, title, summary, thumb, md, keywords } = req.body;
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
    info["posted"] = new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" });
    info["keywords"] = JSON.parse(keywords);
    insertBlogInfo(info);
    next();
}
export { multiUploader, makeFolder, saveFiles, insertDB }