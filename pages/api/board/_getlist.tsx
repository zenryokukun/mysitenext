import type { NextApiRequest, NextApiResponse } from "next";
import { getNewComments } from "../../../lib/db/func";

/**
 * コメントの一覧を返す。
 * board.tsxで使用
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @returns  voide
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).send("Wrong method!");
    }
    try {
        const docs = await getNewComments(1000);
        return res.status(200).json(docs);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Something went wrong!")
    }
}