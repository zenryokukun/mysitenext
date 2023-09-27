// type declaration for `.*mdx` files
// これがないとimport {metadata} from "./test.mdx"としたとき、以下のエラーになる。
// Module '"*.mdx"' has no exported member 'metadata'. Did you mean to use 'import metadata from "*.mdx"' instead?
declare module "*.mdx" {

    import type { MdxMeta } from "./types";
    import type { FrontMatter } from "./types";

    export const mdxMeta: MdxMeta;
    export const frontMatter: FrontMatter;
}