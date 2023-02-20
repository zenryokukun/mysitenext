import { readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import remarkPrism from "remark-prism";
import remarkGfm from "remark-gfm";
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

/**
 * gray-matterで抽出したmdのcontent部分をhtml文字列に変換する.
 * @param md matter(mdfile).content
 * @returns mdからhtml文字列に変換された文字列
 */
export async function toHTMLString(md: string): Promise<string> {
    // remarkGfm -> githubのmd形式に対応したparser。
    const processed = await
        remark()
            .use(remarkGfm)
            .use(remarkPrism)
            .use(html, { sanitize: false })
            .process(md)
    return processed.toString();
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