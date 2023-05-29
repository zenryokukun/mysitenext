import { readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import crypto from "crypto";


/**
 * 更新用mdファイルの中身を返す関数、
 * promiseで返すので呼び出し元でawaitすること
 */
export function getUpdateMd(): Promise<string> {
    const root = path.resolve();
    const fpath = path.join(root, "data/update", "page.md");
    const data = readFile(fpath, { encoding: "utf-8" });
    return data;
}

/**
 * ブログ記事のmdファイルの名k身を返す関数。
 * @param dir ブログ記事の入っているフォルダ名  
 * promiseで返すので呼び出し元でawaitすること
 */
export function getBlogMd(dir: string): Promise<string> {
    const root = path.resolve();
    // const fpath = path.join(root, "data/blog", dir, "page.md");
    const fpath = path.join(root, "public/posts", dir, "page.md");
    const data = readFile(fpath, { encoding: "utf-8" });
    return data;
}


/**
 * gray-matterでmd内のmeta部分と中身を抽出.
 * meta部分は`data`、中身は``content`として抽出される。
 * @param md 読み取ったmdファイルの文字列
 * @returns  {"data":object,"content":string}
 */
export function formatMd(md: string) {
    return matter(md);
}

export function JST(): string {
    return new Date().toLocaleString("ja", { timeZone: "Asia/Tokyo" });
}

export function logger(msg: string): void {
    const dt = JST();
    console.log(`${dt}:${msg}`);
}

export function genSessionId({ id, password }: { id: string, password: string }): string {
    const buf = Buffer.from(id + password);
    const hash = crypto.createHash("sha256").update(buf).digest("hex");
    return hash;
}

/**
 * Date型をYYYY-MM-DDに変換する関数
 * @param d Date
 * @returns YYYY-MM-DD
 */
export function dateToString(d: Date) {
    // mongodbには日本時間文字列→new Date()して投入。ただ、それがUTCとして解釈されるため
    // find()でして使おうとそこからさらにJSTに変換（＋９時間）される。
    // そのため、getUTC~の関数を使う。投入されている時間が日本時間前提で。
    let year = d.getUTCFullYear().toString();
    let monthNum = d.getUTCMonth();
    let month: string;
    let day = d.getUTCDate().toString();

    // Date().getMonth()は0～11がそれぞれ1月~12月に対応。注意。
    monthNum++; // 月に換算するため＋１

    if (monthNum < 10) {
        // 1桁なら前0埋めして文字列に変換。
        month = "0" + monthNum;
    } else {
        // 2桁ならそのまま文字列に変換。
        month = monthNum.toString();
    }

    if (d.getDate() < 10) {
        day = "0" + day;
    }

    return year + "-" + month + "-" + day;
}