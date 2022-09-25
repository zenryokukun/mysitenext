import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { zipFiles } from "./helper";
import { readFile } from "fs/promises";
import { addTarget, multiUpload } from "./middleware"

type Req = NextApiRequest & {
    target: string, //full path
}

// Next.jsのapiでミドルウェアを利用できるようにする。
// エラー、ノーマッチ時の動作を定義。
const router = nextConnect({
    onError: (
        err: Error, req: NextApiRequest, res: NextApiResponse, next: NextApiHandler
    ) => {
        console.log(err);
        res.status(500).end("Something went wrong... Try later!");
    },
    onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
        res.status(404).end("Page not found");
    }
});

// middleware 設定
router.use(addTarget);
router.use(multiUpload);

// endpoint api
router.post(async (req: Req, res: NextApiResponse) => {
    const { ratio, resize, width } = req.body;
    // pythonで切取＆圧縮処理
    try {
        const rcode = await zipFiles(req.target, ratio, resize, width);
        if (rcode !== 0) {
            return res.status(400).send("Something went wrong... Try later!");
        }
    } catch (e) {
        console.log(e);
        return res.status(400).send("Something went wrong... Try later!");
    }

    // 圧縮処理正常終了。クライアントにzipファイルを送る。
    const fpath = req.target + ".zip";
    try {
        const buffer = await readFile(fpath);
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment: filename=zen-crop.zip`);
        return res.send(buffer);
    } catch (e) {
        console.log(e);
        return res.status(400).send("Something went wrong... Try later!");
    }
});

// デフォルトのパーサは無効にしないといけないらしい。
export const config = {
    api: {
        bodyParser: false,
    },
}

export default router;