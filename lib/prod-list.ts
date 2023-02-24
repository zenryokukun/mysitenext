/**
 * Productionページの製作物一覧を取得し返す関数。
 * 一覧ファイルは/data/production.json
 */

import { readFile } from "fs/promises";
import path from "path";
import type { Production } from "../types";

const FILE = path.join(path.resolve(), "data", "production.json");

export default async function productionList() {
    try {
        const content = await readFile(FILE, { encoding: "utf-8" });
        if (!content) throw new Error(`could not open file:${FILE}`);
        const plist: Production[] = JSON.parse(content);
        return plist;
    } catch (err) {
        console.log(err);
    }
}