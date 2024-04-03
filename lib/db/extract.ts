/**
 * 記事一覧を抽出する関数群。関連記事や新着記事等 
 */

// import { findBlogDocs, findMatched, findByField } from "./func";
import { findBlogDocs, findMatched, findByField } from "./sqlite-query-assets";
import { popularDir } from "../ga4";
import sortByDate from "./sort-bloginfo";
import { AssetsRec } from "./sqlite-types";

/**
 * dirで指定したブログを抽出する。assetsDirはユニークなので、１件しか返らない。
 * @param dir 抽出するassetsDirの値
 * @returns 
 */
export async function findByDir(dir: string) {
    const blogRec = await findByField("DIR", dir);
    if (!blogRec) return;
    return blogRec;
}


/**
 * 関連記事抽出する関数。指定されたkeywordsを含むblogを返す。
 * @param BlogInfo 比較元のBlog
 * @returns 一致するキーワードを含むBlogInfo[]
 */
export async function relatedBlogs(targetBlog: AssetsRec | undefined) {

    let rels: AssetsRec[] = [];

    // targetBlogがundefinedなら空配列を返す
    if (!targetBlog) return rels;

    const { DIR, KEYWORDS: keywords } = targetBlog;

    // keywordがundefined、もしくは長さ０の配列なら空配列を返す。
    // undefined->改修前の記事なら発生しうる。長さゼロ->keyword設定していないやつ。
    if (!keywords || keywords.length === 0) return rels;
    const keywordsArr = keywords.split(",");
    // キーワードを含むブログ一覧を取得
    const matchedBlogs = await findMatched(keywordsArr);

    // 自分自身は除外する必要がある点に留意
    for (const blog of matchedBlogs) {
        if (blog.DIR !== DIR) {
            rels.push(blog);
        }
    }

    // ソートする
    rels = sortByDate(rels);

    return rels;
}


/**
 * 記事を新しい順にcnt分返す
 * @param cnt 返す記事数
 * @param opt assetsDir === discludeDirを満たす記事を除外する。除外した上でcnt分返す。
 * @returns 
 */
export async function newBlogs(cnt: number, opt: { discludeDir: string } | undefined = undefined) {
    // blogをcnt+1分取得。登録順にならんでる。並び替えたい時はSQLにORDERBYをつける。
    // 自分自身が含まれる可能性があるのでcnt+1にしている。
    const blogs = await findBlogDocs(cnt + 1);
    if (!blogs || blogs.length === 0) return [];

    // sqlite3では基本昇順に入っているので、降順に並び替えておく
    const sortedBlogs = sortByDate(blogs);

    if (!opt) {
        // option未指定の場合はそのままcnt分返す。
        return sortedBlogs.slice(0, cnt);
    }

    // optionが指定されている場合、discludeDirを除外して返す。
    const newBlogs: AssetsRec[] = [];
    for (const blog of sortedBlogs) {
        if (blog.DIR !== opt.discludeDir) {
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
    const ret: AssetsRec[] = [];
    for (const dir of dirs) {
        const blog = await findByDir(dir);
        if (!blog) continue;
        ret.push(blog);
    }
    return ret.slice(0, cnt);
}