import type { NextApiRequest, NextApiResponse } from "next";
import { updateLike } from "../../../lib/db/func";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (process.env["NODE_ENV"] !== "production") {
        return res.status(200).send("Not updating db! NODE_ENV is not in production mode!!");
    }
    if (req.method !== "POST") {
        return res.status(405).send("Wrong method...");
    }
    if (!req.body.dir) {
        return res.status(400).send("Something went wrong...");
    }
    const result = await updateLike(req.body);
    if (!result) {
        return res.status(400).send("Something went wrong...")
    }
    // update 成功
    res.end();
}