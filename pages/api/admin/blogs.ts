import type { NextApiRequest, NextApiResponse } from "next";
import { findBlogDocs } from "../../../lib/db/func";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).send("Wrong method!");
    }
    try {
        const docs = await findBlogDocs(999);
        return res.status(200).json(docs);
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong.. Try later!");
    }
}