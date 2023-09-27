/**
 * 記事ページに、/post（md）と/new-post（mdx）２つのURLが存在
 * - mdの場合、/public/posts/記事名に.mdや画像ファイルが配置されている。
 * - mdxの場合、/app/new-post/記事名に.mdx
 * 一方、MongoDBの記事情報（nextblog.assets）には、保存先のフォルダ名と、サムネ名しか保持していない。
 * 
 * なお、画像はstatic route(/public)にないと表示できないので、.md,.mdxでも/public/posts/記事名におく。
 * 
 * ページ内リンクを生成する際、.md・.mdxに応じて、ページのRouteとを設定する必要がある。
 * 
 * ex: MDの場合：
 *  route: /post/記事名
 * 
 * ex: MDXの場合
 *  route: /new-post/記事名
 * 
 * .md、.mdxに応じてパスを生成する関数を共通化する。
 * 
 */

import { URL_DIR } from "../component/constants";
import type { BlogInfo } from "../types";

type DuckBlogInfo = Pick<BlogInfo, "assetsDir" | "md">

/**
 * .md、.mdxに応じたページのRouteを返す。
 * サムネ等の画像の保存場所ではないので注意。
 * @param blog DuckBlogInfo
 * @returns 
 */
export default function blogRoute(blog: DuckBlogInfo) {

    const { assetsDir: dir, md } = blog;

    // mdxの場合
    if (md.endsWith(".mdx")) {
        return `/${URL_DIR.MDX}/${dir}`;
    }

    // .mdx以外の場合。.md以外も実行されるが、.mdxと.md以外は想定していないので、いったんは良い。
    // DBのmdフィールドに、.mdx,.md以外が設定されるようになったら考える
    return `/${URL_DIR.MD}/${dir}`;
}


/**
 * リソースの保存場所を返す。
 * .md、.mdxどちらでも、サムネや等は/public/posts/記事名に入っている
 * @param blog DuckBlogInfo
 */
// export function blogResource(blog: DuckBlogInfo) {
//     const { assetsDir: dir, md } = blog;
//     // mdx以外。/public傘下にある。publicはstaticルートなので省略OK。
//     return `/posts/${dir}`;
// }