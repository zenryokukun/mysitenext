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
    // scriptタグに挿入するJSON-ldを使う場合はtrue。
    useBreadCrumb?: boolean,
    // Amazonアソシエイトリンク
    amazonLink?: string,
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
 * Blog情報。DBのassetsDirコレクションに投入する型。
 * Adminページでアップロードする時にも使用する。
 */
export interface BlogInfo {
    genre: string,
    assetsDir: string,
    title: string,
    summary: string,
    thumb: string,
    md: string,
    likes?: number,
    dislikes?: number,
    // 投稿日。更新した場合は更新される。sqlite3対応でstring追加
    posted?: Date | string;
    // 初期投稿日。更新しても変わらない。sqlite3対応でstring追加
    firstPostedDate?: Date | string,
    views?: number,
    // keyword追加
    keywords?: string[],
}

/**掲示板のコメント情報 */
export interface CommentInfo {
    // スレッドのID
    threadSeq: number;
    // スレッドに対するコメントのID。新規スレッドの場合null。
    replySeq: number | null;
    // 属するスレッドのID。新規スレッドの場合null。
    parentSeq: number | null;
    // スレッドのトピック。新規スレッドの場合のみ設定。新規の場合空文字
    topic: string;

    name: string;
    msg: string;
    posted?: string;
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

/**
 * 関連記事データの型。/post/[dir]や他のコンポーネントで利用。
 */
export interface LinkItem {
    // 関連記事のリンク
    url: string;
    // リンクに表示させる文字列
    title: string;
    // 概要
    summary?: string;
    // サムネ
    thumb?: string;
    // 小さいサムネ。FancyBlogLinkdで使う
    thumbSmall?: string;
    // 投稿日。
    posted?: string;
}

/**
 * /pages/productionで表示する製作物のデータ
 * @name string 名前
 * @title string 成果物のタイトル
 * @summary string 概要
 * @href string 成果物へのリンク
 * @imgPath string サムネのパス /publicに置く
 * @alt string サムネが存在しない場合のalt
 * @imgPath string 小さい晩のサムネ。optional.
 */
export interface Production {
    name: string,
    title: string,
    summary: string,
    href: string,
    imgPath: string,
    imgPathSmall?: string,
    alt: string,
    posted: string,
}


/**
 * mdx.d.tsで使用。.mdxでexportするmdxMetaの型。
 * Next.js13のmetadataオブジェクトに設定するmeta情報。
 */
export interface MdxMeta {
    title: string;
    description: string;
    openGraph?: {
        type: string;
        title: string;
        url?: string;
        images?: {
            url: string;
            width: number;
            height: number;
            alt?: string;
        }[]
    };
    twitter?: {
        site: string;
        title: string;
        description: string;
    };
}


/**
 * mdx.d.tsで使用。.mdxでexportするgrayMatterの型。
 * 従来の.mdファイルのgray-matter部分から、meta部分を取り除いたもの。
 */
export interface FrontMatter {
    author: string;
    postedDate: string;
    amazonLink?: string;
}