import { writeFile } from "fs/promises";
import clientPromise, { dbInfo } from "./client";
import { JST } from "../util";
import { genSessionId } from "../util";

import type { MongoClient, WithId, Document } from "mongodb";
import type { UpdateItemRequest } from "../../types";
import type { BlogInfo, CommentInfo } from "../../types";

interface DirFilter {
    assetsDir: string,
}

// mongodbｎ.find().toArray()がWithId<Document>というtypeになるのでキャスト。
interface Auth extends WithId<Document> {
    id: string,
    password: string,
}

/**
 * dbを返す関数
 * @param client 呼び出し元でclientPromiseをawaitしたもの
 * @returns db
 */
function getDB(client: MongoClient) {
    const name = dbInfo["db"];
    const db = client.db(name);
    return db;
}

/**
 * 記事一覧collectionを返す関数。
 * getCollectionの特定版。型有にするために分離。
 * @returns Collection<BlogInfo[]>
 */
async function getAssetsCollection() {
    const client = await clientPromise;
    const db = getDB(client);
    const collection = db.collection<BlogInfo>(dbInfo["colAssets"]);
    return collection;
}

/**
 * コメント一覧のcollectionを返す関数。
 * getCollectionの特定版。型有にするために分離。
 * @param client 呼び出し元でclientPromiseをawaitしたもの
 * @returns 
 */
async function getNewCommentsCollection() {
    const client = await clientPromise;
    const db = getDB(client);
    const collection = db.collection<CommentInfo>(dbInfo["colNewComment"]);
    return collection;
}

/**
 * 内部関数。colパラメタに応じたcollectionを返す汎用関数。型設定が出来ない。
 * mongodbからCollectionを取得し返す。
 * @param client 呼び出し元でclientPromiseをawaitしたもの
 * @param col 取得するコレクション名
 * @returns Collection
 */
function getCollection(client: MongoClient, col: string) {
    const dbName = dbInfo["db"];
    const db = client.db(dbName);
    const collection = db.collection(col);
    return collection;
}

/**
 * assetsコレクションからblogの一覧documentを取得する。  
 * @param limit 抽出するドキュメント数の上限。指定しない場合のdefault上限は999。
 * @returns Promise<WithId<BlogInfo>[]>
 * 戻り値は以下に解決されるPromise。配列に入ってる。
 */
async function findBlogDocs(limit: number = 999) {
    const col = await getAssetsCollection();
    // const docs = col.find().sort({ _id: -1 }).limit(limit).toArray();
    const docs = col.find().sort({ firstPostedDate: -1, posted: -1 }).limit(limit).toArray();
    return docs;
}

/**
 * /post/[dir]/page.tsxでMDブログページの生成に使用。
 * [dir].tsxのパス一覧取得用。mongodbのassetsコレクションのassetsDirフィールドのみ一覧で返す
 * assetsコレクションには.mdと.mdx両方入っているが、.mdのみ一覧で返す。
 */
async function getMDBlogDirList() {
    const col = await getAssetsCollection();
    // *.mdを正規表現に。"."は任意の1文字扱いなので、文字として扱うために"\."のようにエスケープ。
    // \wはアルファベットと数字とアンスコに対応。[A-Za-z0-9_]と同じ。
    // ハイフン入っていると一致しないかも・・・？
    const filter = { md: /\w*\.md$/ }
    const docs = await col.find(filter, { projection: { assetsDir: 1, _id: 0 } }).toArray() as { assetsDir: string }[];
    return docs;
}

/**
 * 指定したfieldとvalueでブログ一覧を検索する。
 * @param field 抽出するfield
 * @param value <T> fieldの値。
 * @returns Promise<WithID<BlogInfo>[]>
 */
async function findByField<T>(field: string, value: T) {
    const col = await getAssetsCollection();
    const query = {
        [field]: value,
    }
    const ret = col.find(query).toArray();
    return ret;
}

/**
 * keywords配列の1つの要素でもマッチするblogの一覧を返す
 * @param keywords 抽出するkeywordのリスト
 * @param desc 降順にソートする場合はtrue(default)
 * @returns Promise<WithID<BlogInfo>[]>
 */
async function findMatched(keywords: string[], desc: boolean = true) {
    const col = await getAssetsCollection();

    const query = {
        keywords: { $in: keywords }
    }

    const ret = col.find(query);

    if (desc) {
        ret.sort({ _id: -1 })
    }

    return ret.toArray()
}

/**
 * DB移行用 /api/tmpで使用。間違えてアクセスしないよう。
 * @param info BlogInfo
 * @returns Promise
 */
async function _migrateBlogInfo(info: BlogInfo) {
    const colName = dbInfo["colAssets"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const result = await col.insertOne(info);
    return result;
}

/**
 * /api/admin/upload　で使用
 * ブログ情報をDBに登録。pages/blogの一覧を取得するのに利用。
 * @param info BlogInfo
 * @returns Promise
 */
async function insertBlogInfo(info: BlogInfo) {
    const col = await getAssetsCollection();
    const result = await col.insertOne(info);
    // insertのリザルトを返す。
    return result;
}

/**
 * /api/admin/update-oneで使用。登録済ブログ情報を一部更新可能
 * 更新が成功した場合、更新後のブログ一覧を返す。
 * @param reqBody 更新キーと更新データをもったオブジェクト
 * @returns Promise
 * 
 */
async function updateBlogInfo(reqBody: UpdateItemRequest) {
    const { updateKey, data } = reqBody;
    const col = await getAssetsCollection();
    const query = { ...updateKey };
    const update = { $set: { ...data } };
    const result = await col.updateOne(query, update);
    return result;
}

interface UpdateMDX {
    genre: string;
    title: string;
    summary: string;
    thumb: string;
    keywords: string[];
    posted: Date;
}

interface UpdateKey {
    [key: string]: string;
}

export async function updateMDXBlogInfo(key: UpdateKey, data: UpdateMDX) {
    const col = await getAssetsCollection();
    const query = { ...key };
    const update = { $set: { ...data } };
    const result = await col.updateOne(query, update);
    return result;
}

/**
 * /api/admin/update で使用。  
 * 上書きモードの時に同じフォルダをもったドキュメントが
 * mongodbに出来てしまうため、削除する。
 * @param filter DirFilter
 * @retunrs Promise
 */
async function deleteDuplicateDir(filter: DirFilter) {
    const col = await getAssetsCollection();
    const result = await col.deleteMany(filter);
    return result;
}

/**
 * dbのassetsコレクションのバックアップをする。
 * @param docs バックアップするデータ。optional。省略した場合、DBから全件取得してBK。
 */
async function backupAssetsCollection(docs?: WithId<BlogInfo>[]) {
    if (!docs) {
        docs = await findBlogDocs();
    }
    const jstr = JSON.stringify(docs, null, 2);
    writeFile("./backup-assetsDir.json", jstr, { encoding: "utf-8" });
}

/**
 * /api/post/like で利用
 * assetsDirコレクションのlikeを1インクリメント
 * @param {dir} 更新するassetsDirコレクションのdir フィールド
 * @returns UpdateResult
 */
async function updateLike({ dir }: { dir: string }) {
    if (!dir) {
        return;
    }
    const col = await getAssetsCollection();
    const result = col.updateOne({ assetsDir: dir }, { $inc: { likes: 1 } });
    return result;
}


/**
 * _app.tsxで使用。遷移するページの訪問数を更新する。
 * NODE_ENVがproductionの時のみ呼ばれる。
 * 詳細は_app.tsxを参照
 * @param dir 更新するpageフィールドの値
 * @returns 
 */
async function updateVisit(dir: string) {
    const colName = dbInfo["colVisits"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const query = { page: dir };
    const update = { $inc: { views: 1 } };
    const opt = { upsert: true };
    const result = col.updateOne(query, update, opt);
    return result;
}


interface Select {
    [key: string]: number;
}
/**
 * 新版のコメントを取得する関数
 * api/board/getlistで使用
 * @param limit 取得するドキュメントの上限数。デフォルト50（少ない）
 * @param select 抽出する項目のオブジェクト。{field1:1,field2:1,_id:0}のように指定。
 * @returns Promise<WithId<CommentInfo>[]>
 */
export async function getNewComments(limit: number = 50, select: Select | undefined = undefined) {
    const col = await getNewCommentsCollection();
    let docs: Promise<WithId<CommentInfo>[]>
    if (!select) {
        docs = col.find().limit(limit).toArray();
    } else {
        docs = col.find({}, select).limit(limit).toArray();
    }
    return docs;
}


// 新版
interface NewCommentProp {
    name: string;
    msg: string;
    // 親スレッドのID。新規スレッドの場合はnull。
    parentSeq: number | null;
    topic: string;
}
/**
 * api/board/commentで使用。コメントをDBに投入、
 * @param param0 NewCommentProp
 * @returns Promise<InsertOneResult<CommentInfo>>
 */
export async function insertNewComment({ name, msg, parentSeq, topic }: NewCommentProp) {
    // ******threadSeq,replySeqの最大値計算********

    // parentSeqが渡されている場合、threadSeqを設定。
    let threadSeq = parentSeq || null;

    // 新規スレッド（parentSeqがnull）ならnullのまま。
    let replySeq: number | null = null;

    // 最大値を計算用。threadSeqとreplySeqのみ取得
    const ids = await getNewComments(1000, { threadSeq: 1, replySeq: 1, _id: 0 });

    // 新規スレッドの場合
    if (!threadSeq) {
        // threadSeqの配列。新規スレッドの場合threadSeqはnullのため、
        // その場合は-1をセット、
        const seqs = ids.map(d => d.threadSeq || -1);

        if (seqs.length === 0) {
            // データがない場合は1を設定
            threadSeq = 1;
        } else {
            // ある場合、最大値＋１。
            const maxThreadSeq = Math.max.apply(null, seqs);
            threadSeq = maxThreadSeq > 0 ? maxThreadSeq + 1 : 1;
        }
    } else {
        // 既存スレッドの場合。
        // 同じthreadSeqのデータ内でreplySeqを計算。
        let seqs = ids.map(d => {
            if (d.replySeq === null) return -1;
            return threadSeq === d.parentSeq ? d.replySeq : -1
        })

        if (seqs.length === 0) {
            replySeq = 1;
        } else {
            const maxReplySeq = Math.max.apply(null, seqs);
            replySeq = maxReplySeq > 0 ? maxReplySeq + 1 : 1;
        }
    }

    // ******Insert処理********
    // mongodbコレクション取得
    const col = await getNewCommentsCollection();
    // 挿入ドキュメント
    const doc: CommentInfo = {
        threadSeq, replySeq, parentSeq, topic,
        name, msg, posted: JST()
    }

    const result = col.insertOne(doc);
    return result;
}


/**
 * /api/loginで使用。入力されたuserとpasswordでナンチャッテ認証
 * @param id string
 * @param pw string
 * @returns　Promise<{ ok: boolean, session: string }> 
 */
async function authenticate(id: string, pw: string): Promise<{ ok: boolean, session: string }> {
    const colName = dbInfo["colAdmin"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const result = await col.find({ id: id }).limit(1).toArray() as Auth[];
    if (Array.isArray(result) && result.length === 0) {
        return { ok: false, session: "" };
    }
    const ok = pw === result[0].password;
    return { ok: ok, session: genSessionId(result[0]) }
}

/**
 * /adminページで行うナンチャッテ認証。
 * @param testStr cookieに設定された認証用文字列
 * @returns boolean
 */
async function isAdmin(testStr: string) {
    const colName = dbInfo["colAdmin"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const result = await col.find({}).limit(1).toArray() as Auth[];
    if (Array.isArray(result) && result.length === 0) {
        return false;
    }
    const realStr = genSessionId(result[0]);
    return testStr === realStr;
}

export {
    findBlogDocs,
    getMDBlogDirList,
    findByField,
    findMatched,
    insertBlogInfo,
    deleteDuplicateDir,
    updateBlogInfo,
    _migrateBlogInfo,
    backupAssetsCollection,
    updateVisit,
    updateLike,
    authenticate,
    isAdmin,
};