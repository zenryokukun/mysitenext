import clientPromise, { dbInfo } from "./client";
import { JST } from "../util";
import type { MongoClient, WithId, Document } from "mongodb";
import { genSessionId } from "../util";

export interface BlogInfo {
    genre: string,
    assetsDir: string,
    title: string,
    summary: string,
    thumb: string,
    md: string,
    likes?: number,
    dislikes?: number,
    posted?: string,
    views?: number,
}

interface DirFilter {
    assetsDir: string,
}

interface InsertComment {
    name: string, msg: string,
}

// mongodbｎ.find().toArray()がWithId<Document>というtypeになるのでキャスト。
interface Auth extends WithId<Document> {
    id: string,
    password: string,
}

/**
 * 内部関数
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
 *   
 * @param limit 抽出するドキュメント数の上限
 * @returns 
 * 戻り値は以下に解決されるPromise。配列に入ってる。
 * [{
    _id: ObjectId("6300ea351ce54aa4a26052bf"),  
    genre: 'travel',  
    assetsDir: '201102_1',  
    title: '九州、そして鼻血',  
    summary: '2011年冬、当時新社会人だった私は、一人九州に旅立つのでした。',  
    thumb: 'nozomi.jpg',  
    md: 'page2.md',  
    likes: 0,  
    dislikes: 0,  
    posted: '8/20/2022, 11:05:41 PM',  
    views: 0  
  },]
 */
async function findBlogDocs(limit: number) {
    const colName = dbInfo["colAssets"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const docs = col.find().sort({ _id: -1 }).limit(limit).toArray();
    return docs;
}

/**
 *
 * [dir].tsxのパス一覧取得用。mongodbのassetsコレクションのassetsDirフィールドのみ
 * 一覧で返す
 */
async function getBlogDirList() {
    const colName = dbInfo["colAssets"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const docs = await col.find({}, { projection: { assetsDir: 1, _id: 0 } }).toArray();
    return docs;
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
    const colName = dbInfo["colAssets"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const result = col.insertOne(info);
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
    const colName = dbInfo["colAssets"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const result = col.deleteMany(filter);
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

/**
 * /api/board/commentsとboard.tsxのgetServerSidePropsで利用
 * コメントの一覧を降順で取得。limitが取得上限
 * @param limit 取得上限
 * @returns Promise 
 */

async function getComments(limit: number) {
    const colName = dbInfo["colComment"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const docs = col.find().sort({ _id: -1 }).limit(limit).toArray();
    return docs;
}

/**
 * /api/board/commentで使用。
 * コメントをDBにinsert。
 * @param {name:string,msg:string} 
 */
async function insertComment({ name, msg }: InsertComment) {
    if (!name || !msg) {
        return;
    }
    const colName = dbInfo["colComment"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const doc = { name, msg, posted: JST() };
    const result = col.insertOne(doc);
    return result;
}

/**
 * /api/post/like で利用
 * assetsDirコレクションのlikeを1インクリメント
 * @param {dir} 更新するassetsDirコレクションのdir フィールド
 * 
 * @returns UpdateResult
 */
async function updateLike({ dir }: { dir: string }) {
    if (!dir) {
        return;
    }
    const colName = dbInfo["colAssets"];
    const client = await clientPromise;
    const col = getCollection(client, colName);
    const result = col.updateOne({ assetsDir: dir }, { $inc: { likes: 1 } });
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
    getBlogDirList,
    insertBlogInfo,
    deleteDuplicateDir,
    _migrateBlogInfo,
    updateVisit,
    getComments,
    insertComment,
    updateLike,
    authenticate,
    isAdmin,
};