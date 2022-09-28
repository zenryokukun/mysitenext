import { insertComment } from "../../../lib/db/func";
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).send("Wrong method!")
    }
    try {
        await insertComment(req.body);
        return res.status(200).send("comment insert succeeded.")
    } catch (err) {
        console.log(err);
        return res.status(500).send("Something went wrong...Try later!")
    }
    res.end();
}