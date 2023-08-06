/**
 * 記事一覧を抽出する関数群。関連記事や新着記事等 
 */

import { BlogInfo } from "../../types";
import { findBlogDocs, findMatched, findByField } from "./func";
import { popularDir } from "../ga4";
import type { WithId } from "mongodb";

/**
 * dirで指定したブログを抽出する。assetsDirはユニークなので、１件しか返らない。
 * @param dir 抽出するassetsDirの値
 * @returns 
 */
export async function findByDir(dir: string) {
    const blogArr = await findByField("assetsDir", dir);
    if (!blogArr || blogArr.length === 0) return;
    return blogArr[0];
}


/**
 * 関連記事抽出する関数。指定されたkeywordsを含むblogを返す。
 * @param BlogInfo 比較元のBlog
 * @returns 一致するキーワードを含むBlogInfo[]
 */
export async function relatedBlogs(targetBlog: BlogInfo | undefined) {

    let rels: WithId<BlogInfo>[] = [];

    // targetBlogがundefinedなら空配列を返す
    if (!targetBlog) return rels;

    const { assetsDir, keywords } = targetBlog;

    // keywordがundefined、もしくは長さ０の配列なら空配列を返す。
    // undefined->改修前の記事なら発生しうる。長さゼロ->keyword設定していないやつ。
    if (!keywords || keywords.length === 0) return rels;

    // キーワードを含むブログ一覧を取得
    const matchedBlogs = await findMatched(keywords);

    // 自分自身は除外する必要がある点に留意
    for (const blog of matchedBlogs) {
        if (blog.assetsDir !== assetsDir) {
            rels.push(blog);
        }
    }

    return rels;
}


/**
 * 記事を新しい順にcnt分返す
 * @param cnt 返す記事数
 * @param opt assetsDir === discludeDirを満たす記事を除外する。除外した上でcnt分返す。
 * @returns 
 */
export async function newBlogs(cnt: number, opt: { discludeDir: string } | undefined = undefined) {
    const ret: BlogInfo[] = [];
    // blogをcnt+1分取得。降順（新しい順）に並んでいる点に留意。
    // 自分自身が含まれる可能性があるのでcnt+1にしている。
    const blogs = await findBlogDocs(cnt + 1);
    if (!blogs) return ret;
    // option未指定の場合はそのままcnt分返す。
    if (!opt) {
        return blogs.slice(0, cnt);
    }

    // optionが指定されている場合、discludeDirを除外して返す。
    const newBlogs: WithId<BlogInfo>[] = [];
    for (const blog of blogs) {
        if (blog.assetsDir !== opt.discludeDir) {
            newBlogs.push(blog);
        }
    }
    // 全てマッチした場合cnt+1分返ってしまうのでslice.
    return newBlogs.slice(0, cnt);
}


/**
 * アクセス数（pageView数）が上位のblog記事を抽出する。
 * @param cnt 返す記事数
 * @returns 
 */
export async function popularBlogs(cnt: number) {
    const dirs = await popularDir(cnt);
    const ret: BlogInfo[] = [];
    for (const dir of dirs) {
        const blog = await findByDir(dir);
        if (!blog) continue;
        ret.push(blog);
    }
    return ret.slice(0, cnt);
}