/**
 * ComponentやPage、API間で共通して利用される型を記載していく。
 * それぞれ独立して同じ型を記載してしまっている箇所もあるので、気づいたら移していく。
 */


/**
 * MyHead Componentのprops
 * ブログ用mdのfront matter部分にしておけば、そのページのMyHeadに設定してくれる
 */
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

/**
 * Adminページの更新モードで使用。一度登録したblog情報で更新可能な項目。
 * BlogInfo型（/lib/db/funcにある、、、いずれここに移したい）とキー名は揃えること。
 */
export interface UpdateItem {
    genre?: string,
    title?: string,
    summary?: string,
    keywords?: string[],
}

/**
 * /api/admin/update-oneで使用されるrequest.bodyの型
 */
export interface UpdateItemRequest {
    updateKey: { assetsDir: string }, // db更新のキー
    data: UpdateItem,
}