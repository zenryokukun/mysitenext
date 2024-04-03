import type { BlogInfo } from "../../../types";
import type { AssetsRec } from "../../../lib/db/sqlite-types";

/**
 * sqlite3移行対応。
 * ASSESTテーブル:AssetsRec（新）とassetコレクション:BlogInfo（旧）の
 * 型が異なるため、AssetsRec->BlogInfoにキャスト。
 * 基本は書き換えたいが、Adminは複雑で使用箇所も多いため、
 * route.ts内でキャストして返すこととし、呼び出し側での修正箇所を減らす。
 * /blog、/post、/new-post等、他のrouteでは利用しない想定。
 * 
 * @param rec BlogInfo型に変換するAssetsRec
 * @returns 
 */
export default function cast(rec: AssetsRec) {
    const blog: BlogInfo = {
        genre: rec.GENRE,
        assetsDir: rec.DIR,
        title: rec.TITLE,
        summary: rec.SUMMARY,
        thumb: rec.THUMB,
        md: rec.MD,
        likes: rec.LIKES,
        dislikes: rec.DISLIKES,
        posted: rec.POSTED,
        firstPostedDate: rec.FIRST_POSTED_DATE,
        views: rec.VIEWS,
        keywords: rec.KEYWORDS.split(","),
    };
    return blog;
}