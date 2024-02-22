/**
 * 型：BlogInfo[]のkeywordsを重複なしのデータとして返す。
 * Setと名前がついているが、返すのはArray。「重複なし」の意味でSet。
 * 初期に展開していた旅行系のkeywordは除外する
 */


interface WithKeywords {
    genre: string;
    keywords?: string[];
}

export default function keywordsSet(docs: WithKeywords[]) {
    let kwList: string[] = [];
    for (const doc of docs) {
        // keywordなし、もしくは旅行系なら何もしない。
        if (!doc.keywords || doc.genre === "travel") continue;
        kwList.push(...doc.keywords);
    }
    // Setに変換して重複削除
    const kwSet = new Set(kwList)
    kwList = Array.from(kwSet);
    return kwList.sort();
}