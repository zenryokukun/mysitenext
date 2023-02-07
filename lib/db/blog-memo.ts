import type { WithId } from "mongodb";

/**
 * サーバでblog一覧保持するグローバル変数をexport。
 * 20230204時点でまだ使われていない。。。。
 */

import { findBlogDocs } from "./func";
import type { BlogInfo } from "../../types";

// blogを保持するグローバル変数。memoization
let blogMemo: WithId<BlogInfo>[] | null = null;

// blog更新関数
export async function updateBlogMemo() {
    const docs = await findBlogDocs(999);
    if (!docs) return;
    blogMemo = docs;
}

// blogを取得する関数
export function getBlogMemo() {
    return blogMemo;
}

// 初回のみ実行。起動時のみに呼ばれる想定
if (!blogMemo) {
    (async () => {
        blogMemo = (await findBlogDocs(999));
    })();
}


