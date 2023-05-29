import { remark } from "remark";
import html from "remark-html";
import remarkPrism from "remark-prism";
import remarkGfm from "remark-gfm";

/**
 * gray-matterで抽出したmdのcontent部分をhtml文字列に変換する.
 * remarkPrismでシンタックスハイライト。
 * /appでimportとワーニングが出るので、個別に切り出し。
 * @param md matter(mdfile).content
 * @returns mdからhtml文字列に変換された文字列
 */
export async function toHTMLString(md: string): Promise<string> {
    // remarkGfm -> githubのmd形式に対応したparser。
    const processed = await
        remark()
            .use(remarkGfm)
            .use(remarkPrism)
            .use(html, { sanitize: false })
            .process(md)
    return processed.toString();
}