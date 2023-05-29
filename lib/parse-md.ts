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