/**
 * sqliteのdbのレコード情報。
 * 各カラムの説明はcreate文のファイルを確認。
 * もしくは.schemaコマンドで見られる。
 * 
 * sqlite関連の他の型も、ファイル共通で使う場合は入れておく、、
 */

export interface AssetsRec {
    GENRE: string;
    DIR: string;
    TITLE: string;
    SUMMARY: string;
    THUMB: string;
    MD: string;
    LIKES: number;
    DISLIKES: number;
    VIEWS: number;
    POSTED: string;
    FIRST_POSTED_DATE: string;
    KEYWORDS: string;
}

export interface AdminRec {
    ID: string;
    PASSWORD: string;
}

export interface NewCommentsRec {
    THREAD_SEQ: number;
    REPLY_SEQ: number | null;
    PARENT_SEQ: number | null;
    TOPIC: string;
    NAME: string;
    MSG: string;
    POSTED: string;
}


/**
 * updateやinsertの結果を返す。mongodb時代に使っていたので実装。
 */
export interface Result {
    acknowledged: boolean;
}