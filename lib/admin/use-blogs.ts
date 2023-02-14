/**
 * adminページが大きくなったのでロジック部分をカスタムフックで分離。
 * ブログ一覧と、ブログ一覧から生成したキーワード一覧をstateとして返す。
 * 
 * Admin（最上位）コンポーネントで使う。下位のInsertモードとUpdateモードの両方で
 * キーワード一覧を使うので、Adminで呼び出す必要がある。
 */

import { useEffect, useState } from "react";
import { BlogInfo } from "../../types";

// db取得値のmemoization
let _blogs: BlogInfo[] | null;

/**
 * ブログ一覧からキーワード（重複なし）を抽出して昇順でソートして返す。
 * 重複を排除するため、配列→Set→配列と変換する。
 * @param docs 
 * @returns 
 */
function keywordList(docs: BlogInfo[]) {
    const kw: string[] = [];
    for (const doc of docs) {
        if (!doc.keywords) continue;
        kw.push(...doc.keywords)
    }
    const kwSet = new Set(kw);
    const kwArr = Array.from(kwSet);
    return kwArr.sort();
}


/**
 * adminページのblog取得useEffectをカスタムフック化
 * dbの取得が終わればcurrentBlogsにBlogInfo[]が入る。ロード中はnull。
 * blogをもとにkeyword一覧もstateとして抽出する。
 */
export function useBlogs() {
    // blogのstate
    const [currentBlogs, setCurrentBlogs] = useState<BlogInfo[] | null>(_blogs);
    // keywordのstate
    const [keywords, setKeywords] = useState<string[] | null>(null);

    // 初回ロードのみ実行。blogをdbからセット
    useEffect(() => {
        // renderごとにdbから抽出されないように、memoに値があれば何もせずreturnする。
        if (_blogs) return;

        // サーバからデータ取得
        fetch("/api/admin/blogs", {
            method: "GET",
        })
            .then(async (res) => {
                if (!res.ok) {
                    // レスポンスが200系以外はエラーにする
                    const emsg = await res.text();
                    throw new Error(emsg);
                }
                // 正常時はjsonでパース
                return res.json();
            })
            .then((data: BlogInfo[]) => {
                // memoを更新し、state更新
                _blogs = data;
                setCurrentBlogs(data);
            })
            .catch(err => alert(err));
    }, []);

    // keyword更新。blogに依存するため、currentBLogsをdependencyにしてuseEffect。
    useEffect(() => {
        // dbロード前は何もせずリターン。
        if (!currentBlogs) return;
        // currentBlogsをもとにkeywordを抽出
        const kwlist = keywordList(currentBlogs)
        setKeywords(kwlist);
    }, [currentBlogs]);

    // blog,keywordのstateと更新関数をオブジェクトで返す。
    return {
        currentBlogs, setCurrentBlogs,
        keywords, setKeywords
    };
}