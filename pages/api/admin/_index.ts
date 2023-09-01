import type { NextApiRequest, NextApiResponse } from "next"
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

export default async function getConfig(req: NextApiRequest, res: NextApiResponse) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const confPath = path.join(__dirname, "conf.json");
    try {
        const content = await readFile(confPath, { encoding: "utf-8" });
        const data = JSON.parse(content);
        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(400).send("Something went wrong...")
    }
}