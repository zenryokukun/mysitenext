/**
 * Assetsテーブルを日付順（降順）にソートする関数
 * postedフィールド:  投稿日。更新した場合は更新される。
 * firstPostedフィールド：初期投稿日。更新しても変わらない。
 * 
 * 記事アップロード時、postedフィールドを更新していたが、過去の記事を修正した際、
 * 並び順が上に来てしまった。並び順を変えないよう、後からfirstPostedを追加した。
 * そのため、追加前の記事で、更新をしていないものはfirstPostedが設定されていないものがある。
 * 
 * 関連記事などで、並び順が投稿日順にならない場合があるので、posted | firstPostedでソート。
 * 
 * @TODO SQLのORDER BYでソートしたほうがシンプルかも。検討
 */

import type { AssetsRec } from "./sqlite-types";

interface Comparable extends AssetsRec {
    // '2023/4/1 23:00:11'のような日付の文字列の比較が想定通りにならないため、
    // 日付型で比較する
    compare: Date;
}

/**
 * Array.prototype.sortのcallback。
 * Comparable.compareの降順でソート
 * @param a Comparable
 * @param b Comparable
 * @returns number
 */
function sort(a: Comparable, b: Comparable) {

    if (!a.compare || !b.compare) {
        // 変更なし
        return 0;
    }

    // sqlite3移行に伴い追加。基本compareはstringになるが、
    // 万一Dateとstringが混ざっているケースは変更なしとする。
    if (typeof a.compare !== typeof b.compare) {
        // 変更なし
        return 0;
    }

    if (a.compare < b.compare) {
        // [b,a]
        return 1;

    } else if (a.compare > b.compare) {
        // [a,b]
        return -1;
    }

    // 変更なし
    return 0;
}

export default function sortByDate(blogs: AssetsRec[]) {

    const comparable: Comparable[] = blogs.map(blog => {
        // firstPostedDateが定義されていなければ、blog.postedを使う。
        const compareStr = blog.FIRST_POSTED_DATE || blog.POSTED
        const compare = new Date(compareStr);
        return { ...blog, compare };
    });
    // comparableをmutateするので留意。
    comparable.sort(sort);

    // WitId<BlogInfo>[]型として返す。使う側で型違うと面倒だし、、
    return comparable as AssetsRec[];
}