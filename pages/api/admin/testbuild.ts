import type { NextApiRequest, NextApiResponse } from "next";
import { buildTest } from "../../../lib/build"

export default function testBuild(req: NextApiRequest, res: NextApiResponse) {
    console.log("testBuild API called")
    buildTest();
    res.end();
}