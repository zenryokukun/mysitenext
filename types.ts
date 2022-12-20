/**
 * ComponentやPage感で共通して利用される型を記載していく。
 * それぞれ独立して同じ型を記載してしまっている箇所もあるので、気づいたら移していく。
 */

// MyHead Componentのprops
// ブログ用mdのfront matter部分にしておけば、そのページのMyHeadに設定してくれる
export interface HeadProp {
    // web pageのタイトル
    title: string,
    // meta description
    metaDescription?: string,
    // scriptタグに挿入するJSON-ld形式のパンくずリスト。
    breadCrumbsJSON_ld?: string,

    //**************************************************
    // 以下 twitter card用
    //**************************************************

    // twitter:cardに設定。“summary”、“summary_large_image”、“app”、“player”のいずれか
    // defaultは"summary"
    summary?: string,
    // twitter:siteに設定。twitterのユーザ名
    // defaultは@zenryoku_kun0
    site?: string,
    // twitter:titleに設定
    cardTitle?: string,
    // twitter:descriptionに設定
    description?: string,
    // twitter:imageに設定
    imagePath?: string,
}