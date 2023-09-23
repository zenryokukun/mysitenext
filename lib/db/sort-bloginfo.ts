/**
 * MONGO DBのassetsコレクションを日付順（降順）にソートする関数
 * postedフィールド:  投稿日。更新した場合は更新される。
 * firstPostedフィールド：初期投稿日。更新しても変わらない。
 * 
 * 記事アップロード時、postedフィールドを更新していたが、過去の記事を修正した際、
 * 並び順が上に来てしまった。並び順を変えないよう、後からfirstPostedを追加した。
 * そのため、追加前の記事で、更新をしていないものはfirstPostedが設定されていないものがある。
 * 
 * 関連記事などで、並び順が投稿日順にならない場合があるので、posted | firstPostedでソート。
 * 
 */

import type { WithId } from "mongodb";
import type { BlogInfo } from "../../types";

interface Comparable extends WithId<BlogInfo> {
    // firstPosted || posted
    compare: Date | undefined;
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

export default function sortByDate(blogs: WithId<BlogInfo>[]) {

    const comparable: Comparable[] = blogs.map(blog => {
        // firstPostedDateが定義されていなければ、blog.postedを使う。
        const compare = blog.firstPostedDate || blog.posted
        return { ...blog, compare };
    });

    // comparableをmutateするので留意。
    comparable.sort(sort);

    // WitId<BlogInfo>[]型として返す。使う側で型違うと面倒だし、、
    return comparable as WithId<BlogInfo>[];
}