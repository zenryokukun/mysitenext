/**
 * rehypeを使ってmdをパース。
 * util.tsのtoHTMLStringはremark-htmlでパースしている。
 * remark-prismをappで使うとエラーになるため分離
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrism from "rehype-prism";
import rehypeStringify from "rehype-stringify";

/**
 * syntax-higlightする言語はここで読み込む必要がある。
 * 言語別にトークンを分割してくれるが、サーバサイドで動く点に留意。
 * `use client`しているコンポーネントではエラーになる。
 */
import "prismjs/components/prism-python"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-go"
import "prismjs/components/prism-json"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-powershell"
import "prismjs/components/prism-docker"
import "prismjs/components/prism-sql"


export default async function parseMd(md: string) {
    const vfile = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypePrism)
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(md);
    return vfile.toString();
}