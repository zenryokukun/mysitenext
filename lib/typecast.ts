/**
 * 型キャストを行う関数
 * BlogInfo -> LinkItem
 * Production -> LinkItem
 */

import blogRoute from "./blog-route";
import type { LinkItem, Production } from "../types";
import type { AssetsRec } from "./db/sqlite-types";

/**
 * [sqlite3版] AssetsRec -> LinkItem型の変換
 * @param b ASSETSテーブルのレコード
 * @returns {LinkItem}
 */
export function assetsRecToLinkItem(b: AssetsRec): LinkItem {
    /**
     * サムネは/blogページ用と、サイドバーや/homeページのFancyBlogLinks用の2種類ある
     * /blogページ用：mongodbの`thumb`フィールドで定義。なお、サムネ等はmd,mdxどちらでも/public/postsにある。
     * FancyBlogLinks用：
     * 　各記事フォルダの直下に、`thumb-small.png`の名前で保存されている。
     * 　後から追加しているため、mongodbのほうは手を入れず、固定名での対応とする。
     * 　そもそも/blogページ用のサムネが無いケースもある。サムネの有無は/blogとFancyBlogLinksで
     * 　必ず揃えること。
     */
    // 投稿日設定。初期投稿日優先。postedは更新があった時に更新日が設定される。
    const _posted = b.FIRST_POSTED_DATE || b.POSTED;
    const posted = _posted || "-";
    return {
        // url: `/post/${b.assetsDir}`,
        url: blogRoute(b.DIR, b.MD),
        title: b.TITLE,
        summary: b.SUMMARY,
        // サムネは/public/postsにある。。。/postはPageで異なるので注意。
        thumb: b.THUMB ? `/posts/${b.DIR}/${b.THUMB}` : "",
        thumbSmall: b.THUMB ? `/posts/${b.DIR}/thumb-small.png` : "",
        posted: posted,
    };
}

export function productionToLinkItems(p: Production): LinkItem {
    /**
     * サムネは/productionページ、/homeページのFancyBlogLinks用の2種類ある。
     * production.jsonの`imgPath`がProductionページ、`imgPathSmall`がHomeページ用のサムネ
     */
    return {
        url: p.href,
        title: p.title,
        summary: p.summary,
        thumb: p.imgPath,
        thumbSmall: p.imgPathSmall,
        posted: p.posted,
    }
}