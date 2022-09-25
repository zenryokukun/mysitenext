/**
 * DB移行用　同じにしても良かったけど、テスト中のが反映されても嫌なので。
 * 間違ってブラウザでアクセスしないようにしてください。
 * 移行が終わったら消してよい。
 */

import { readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { _migrateBlogInfo } from "../../lib/db/func"
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const dataPath = "C:\\Users\\bathi\\Documents\\pgm\\a.json";
    const content = readFileSync(dataPath, { encoding: "utf-8" })
    const data = JSON.parse(content);
    for (const d of data) {
        d["_id"] = new ObjectId(d["_id"])
    }
    //sort
    for (let i = 1; i < data.length; i++) {
        const checkee = data[i];
        for (let j = 0; j < i; j++) {
            const checker = data[j];
            if (checkee._id < checker._id) {
                data[j] = checkee;
                data[i] = checker;
                break;
            }
        }
    }

    for (const d of data) {

        await _migrateBlogInfo(d);

    }



    res.end()
}