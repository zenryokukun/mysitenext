import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { multiUploader, saveFiles, makeFolder, insertDB } from "./middleware";
import build from "../../../lib/build";

const onerror = (err: Error, req: NextApiRequest, res: NextApiResponse) => {
    console.log(err)
    res.status(500).end("Something went wrong... Try later!")
}
const onnomatch = (req: NextApiRequest, res: NextApiResponse) => res.status(404).end("Endpoint not found")


const router = nextConnect({ onError: onerror, onNoMatch: onnomatch });
router.use(multiUploader);

router.post(makeFolder, saveFiles, insertDB, (req: NextApiRequest, res: NextApiResponse) => {
    build() //ビルド
    res.status(200).send("Upload succeeded!")
});

export const config = {
    api: {
        bodyParser: false,
    },
}

export default router;