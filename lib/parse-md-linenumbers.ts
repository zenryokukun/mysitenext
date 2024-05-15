/**
 * parse-md.tsのline-height（行数）を表示するバージョン
 * 従来のparse-md.tsはかなりの記事数で使われているので、
 * 別モジュールとして作っといた。
 * 
 * line-numberを出すために、rehype-prismではなくrehype-prism-plusを使っている。
 * md側で以下のように指定する。｛｝内はハイライトする行
 *  ```python {1,3-5} showLineNumbers
 *  def test():
 *    print("hello,world")
 *  ```
 * 
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";

/**
 * syntax-higlightする言語はここで読み込む必要がある。
 * 言語別にトークンを分割してくれるが、サーバサイドで動く点に留意。
 * `use client`しているコンポーネントではエラーになる。
 */

export default async function parseMd(md: string) {
    const vfile = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        // @ts-ignore これが出る、、、→Property 'use' does not exist on ty＠ts-ignore
        .use(rehypePrism)
        // @ts-ignore Dockerビルド時にこれが出る、、、：Type error: Property 'use' does not exist on type 'never'.
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(md);
    return vfile.toString();
}