import type { MdxMeta } from "../../types";

/**
 * mdxブログページのmetadataを生成する。open-graphやtwitterの指定されていない場合はページと同じものを使う。
 * 画像はデフォルトのものを使う
 * @meta MdxMeta
 * @dir /app/new-post直下のフォルダ名
 */

export default function generateMeta(meta: MdxMeta, dir: string) {

    // 生成するページのurl
    const url = `https://www.zenryoku-kun.com/new-post/${dir}`
    // open-graph画像。/public/opengraph-zen-logo.jpgをデフォルトとして設定。指定が無い場合はこれを使う
    const domain = process.env.NODE_ENV !== "production" ? "http://localhost:3000/" : "https://www.zenryoku-kun.com/"
    const imagePath = domain + "opengraph-zen-logo.jpg";

    // opengraphが設定されていない場合、meta.titleとmeta.descriptionの内容で設定。
    // 画像は上記のデフォルトを使用
    if (!meta.openGraph) {
        meta.openGraph = {
            type: "website",
            title: meta.title,
            url: url,
            images: [{
                url: imagePath,
                width: 1200,
                height: 630,
                alt: "my-logo"
            }]
        }
    }

    // opengraphが設定されていない場合、meta.titleとmeta.descriptionの内容で設定。
    // Twitterの仕様変更で画像表示されなくなったようなので、画像は何もしないでおく。。。
    if (!meta.twitter) {
        meta.twitter = {
            site: "@zenryoku_kun0",
            title: meta.title,
            description: meta.description,
        }
    }
    return meta;
}