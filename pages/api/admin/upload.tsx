/**
 * /pages/adminで使用。ブログ記事のアップロードで使う。
 * アップロード後、最新のブログ情報を返す。
 */

import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { multiUploader, saveFiles, makeFolder, insertDB } from "./middleware";
import { backupAssetsCollection, findBlogDocs } from "../../../lib/db/func";
import build from "../../../lib/build";

const onerror = (err: Error, req: NextApiRequest, res: NextApiResponse) => {
    console.log(err)
    res.status(500).end("Something went wrong... Try later!")
}
const onnomatch = (req: NextApiRequest, res: NextApiResponse) => res.status(404).end("Endpoint not found")


const router = nextConnect({ onError: onerror, onNoMatch: onnomatch });
router.use(multiUploader);

router.post(makeFolder, saveFiles, insertDB, async (req: NextApiRequest, res: NextApiResponse) => {
    build(); //ビルド
    // res.status(200).send("Upload succeeded!")
    const blogs = await findBlogDocs();
    backupAssetsCollection(blogs); // バックアップ
    const resData = { blogs, msg: "upload succeeded!" };
    res.status(200).json(resData);
});

export const config = {
    api: {
        bodyParser: false,
    },
}

export default router;