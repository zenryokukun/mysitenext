/**
 * app/updatesのdata-fetch関数。SSG
 * 
 * appだとremark-prismがエラーになる（serverコンポ）では
 * client apiは使えない（windowとか？）ようなので。。。
 * updatesページはプログラムのソースは載せない想定なので、
 * remark-prismを除外した関数として実装
 */
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import { getUpdateMd, formatMd } from "../../lib/util";

export default async function getProps() {
    const md = await getUpdateMd();
    const gm = formatMd(md);
    /**
     * appだとremark-prismがエラーになる（serverコンポ）では
     * client apiは使えない（windowとか？）ようなので。。。
     * updatesページはプログラムのソースは載せない想定なので、
     * remark-prismを除外した関数として実装
     */
    const vfile = await remark()
        .use(remarkGfm)
        .use(remarkHtml, { sanitize: false })
        .process(gm.content)

    return vfile.toString();
}