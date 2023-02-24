import type { BlogInfo, LinkItem, Production } from "../types";

export function blogInfoToLinkItem(b: BlogInfo): LinkItem {
    return {
        url: `/post/${b.assetsDir}`,
        title: b.title,
        summary: b.summary,
        // サムネは/public/postsにある。。。/postはPageで異なるので注意。
        thumb: b.thumb ? `/posts/${b.assetsDir}/${b.thumb}` : "",
        posted: b.posted || "",
    };
}

export function productionToLinkItems(p: Production): LinkItem {
    return {
        url: p.href,
        title: p.title,
        summary: p.summary,
        thumb: p.imgPath,
        posted: p.posted,
    }
}