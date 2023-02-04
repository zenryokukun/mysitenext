import { isAdmin } from "../../../lib/db/func";
import { updateBlogInfo } from "../../../lib/db/func";
import type { NextApiRequest, NextApiResponse } from "next";
import type { UpdateItemRequest } from "../../../types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Post以外はエラー
    if (req.method !== "POST") {
        return res.status(405).send("Wrong method!");
    }

    // 所定のcookieがなければエラー
    if (!req.cookies.user) {
        return res.status(401).send("Unauthorized");
    }

    // 管理者じゃなければエラー
    const isAuthorized = await isAdmin(req.cookies.user);
    if (!isAuthorized) {
        return res.status(401).send("Unauthorized");
    }

    // Next.jsはapplication/jsonは勝手にparseしてくれる。
    // UpdateItemRequestには更新キーと更新データが入ってる。
    const body: UpdateItemRequest = req.body;
    // db更新処理。
    const blogs = await updateBlogInfo(body);
    if (!blogs) {
        return res.status(500).send("something went wrong...Try later!")
    }
    res.status(200).json(blogs);
}