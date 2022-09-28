import type { NextApiRequest, NextApiResponse } from "next";
import { updateVisit } from "../../lib/db/func";

/**
 * dbのvisitsコレクションのページビューを更新する。
 * bodyのdirはドキュメント名（home,about,201102_1,...）等が設定される想定
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @returns void
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (process.env["NODE_ENV"] !== "production") {
        res.status(200).send("Not updating db! NODE_ENV is not in production mode!!");
    }
    if (req.method !== "POST") {
        res.status(405).send("Wrong method....");
    }
    const { dir } = req.body;
    try {
        await updateVisit(dir);
    } catch (err) {
        console.log(err);
    }
    return res.end();
}