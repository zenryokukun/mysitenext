/**
 * 記事一覧を抽出する関数群。関連記事や新着記事等 
 */

import type { WithId } from "mongodb";
import { BlogInfo } from "../../types";
import { getBlogMemo } from "./blog-memo";

/**
 * 関連記事抽出する関数。指定されたkeywordsを含むblogを返す。
 * @param kw keywordの配列
 * @returns 一致するキーワードを含むBlogInfo[]
 */
export async function relatedBlogs(targetBlog: BlogInfo | undefined) {
    // blogのmemoizationを取得
    const memo = await getBlogMemo();
    // 戻り値
    const rels: BlogInfo[] = [];
    // memoやtargetBlogが定義されていない場合は空配列を返す
    if (!memo || !targetBlog) return rels;

    const { keywords: targetKeywords, assetsDir: targetAssetsDir } = targetBlog;

    // targetBlogにkeywordsが設定ｓあれていない場合は空配列を返す
    if (!targetKeywords) return rels;
    // memoを走査し、targetのキーワードと一致するデータをrelにプッシュ。
    // 自分自身は除外する必要がある点に留意
    memo.forEach(blog => {
        // keywrodsが設定されていないデータは次の走査に移る。
        if (!blog.keywords) return;
        // 自分自身の場合（targetのassetsDirと一致）は何もせず次の走査に移る。
        if (targetAssetsDir === blog.assetsDir) return;
        // blogのkeywordsを操作し、targetのキーワードと一致していればrelにプッシュ。
        for (const kw of blog.keywords) {
            if (targetKeywords.includes(kw)) {
                rels.push(blog);
                break;
            }
        }
    });
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
    // blogのmemoizationを取得。降順（新しい順）に並んでいる点に留意。
    const memo = await getBlogMemo();
    if (!memo) return ret;
    // option未指定の場合はそのままcnt分返す。
    if (!opt) {
        return memo?.slice(0, cnt);
    }

    // optionが指定されている場合、opt.discludeを除いてcnt分返す。
    // cntより1つ多くslice。
    const blogs = memo?.slice(0, cnt + 1);
    const newBlogs: WithId<BlogInfo>[] = [];
    for (const blog of blogs) {
        if (blog.assetsDir !== opt.discludeDir) {
            newBlogs.push(blog);
        }
    }
    return newBlogs;
}