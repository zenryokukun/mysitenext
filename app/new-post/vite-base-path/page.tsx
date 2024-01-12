/**
 * ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
 * [重要]
 * このファイルは例外的に固有CSSを読み込んでいる。コピペしないように！！！
 * ">"" のblockquote内のタグが文字列として扱われず、`expected clocing tag`のエラーが出る。
 * そのため、quote部分を""で囲んだところ、blockquote>p>codeとパースされた。
 * codeタグの固有のCSSが適用され？見にくいので、固有のunique.cssを作成して対応した。
 * ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
 * 
 * .mdx版ブログページのテンプレート。コピペして`DIR`のみ編集でいけるようにする。
 * 今後の修正を減らすため、ここでstylingや不要な処理は加えないように！
 * 
 * [slug]で動的にmdxをimportしようとするとエラーになり、解決できなかった。
 * やむなく、MdxLayoutにラップしてmdxを渡す形式に変更。
 * 
 */

// mdxページ用汎用レイアウト。従来の.md版ページと同じにしている。
import MdxLayout from "../MdxLayout";
import generateMeta from "../generateMeta";
// mdxファイルでexportされるオブジェクト。meta情報と、frontmatter部分の情報。
import { mdxMeta, frontMatter } from "./page.mdx";
// mdxのコンテンツ
import Content from "./page.mdx";

// このページ固有のCSS
import "./unique.css";

import type { Metadata } from "next";

const DIR = "vite-base-path";

export const metadata: Metadata = generateMeta(mdxMeta, DIR)


export default function Page() {
  return (
    <MdxLayout dir={DIR} frontMatter={frontMatter} >
      <Content></Content>
    </MdxLayout >
  );
}