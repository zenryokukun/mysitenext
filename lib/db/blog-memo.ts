import type { WithId } from "mongodb";

/**
 * サーバでblog一覧保持するグローバル変数をexport。
 * DBからの取得が非同期で行われるのと、importも非同期に行われるので、
 * グローバル変数にアクセスする関数は全てasync functionで実装すること
 */

import { findBlogDocs } from "./func";
import type { BlogInfo } from "../../types";

// blogを保持するグローバル変数。memoization
let blogMemo: WithId<BlogInfo>[] | null = null;

// blogロード内部関数
async function load() {
    blogMemo = await findBlogDocs(999);
}

// blog更新関数
export async function updateBlogMemo() {
    const docs = await findBlogDocs(999);
    if (!docs) return;
    blogMemo = docs;
}

// blogを取得する関数。ロードされてない場合があるのでasyncに。
export async function getBlogMemo() {
    if (!blogMemo) {
        await load();
    }
    return blogMemo;
}

// assetsDirでfilterする関数
export async function filterBlogMemo(assetsDir: string) {
    const memo = await getBlogMemo();
    if (!memo) return;
    for (const blog of memo) {
        if (blog.assetsDir === assetsDir) {
            return blog;
        }
    }
    return;
}

// 初回のみ実行。起動時のみに呼ばれる想定
if (!blogMemo) {
    (async () => await load())();
}


