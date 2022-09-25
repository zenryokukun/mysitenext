/**
 * 前のサイトから持ってきたやつ。client.tsにマージ中。
 * 後削除予定。
 */

import { MongoClient, ObjectId } from "mongodb";
import * as fs from "fs/promises";

interface DbInfo {
    url: string,
    db: string,
    colAssets: string,
    colComment: string,
    colVisits: string,
}

interface BlogInfo {
    genre: string,
    assetsDir: string,
    title: string,
    summary: string,
    thumb: string,
    md: string,
    posted?: string,
}

// mongo db client
// poolingのため一応グローバルにしとく
let client: MongoClient;
// db info
let dbInfo: DbInfo;

// プログラム終了時にconnection切っておく
process.on("exit", () => {
    if (client) {
        console.log("closing db connection...");
        client.close();
    }
});
// ctrl + c 等でキャンセルした時もconnection切る
process.on("SIGINT", () => {
    // これないとexitしない。上のexit内の処理も呼ばれるため、ここではcloseしなくてOK。
    process.exit();
});


// 初期化処理
// 起動時のみに接続し、exit時に切断する。
// 都度都度　接続⇒切断としているとエラーになることがあるので、、、
async function init(path: string) {
    const data = await fs.readFile(path, { encoding: "utf-8" }).then(data => JSON.parse(data));
    const { url } = data;
    client = new MongoClient(url);
    dbInfo = data;
    await client.connect();
}

/**
 * Uploads info to mongoDB. Inserts to `assets` collection.
 * info:{
 *   "genre":string,
 *   "assetsDir":string,
 *   "title":string,
 *   "summary":string,
 *   "thumb":string,
 *   "md":string,
 * }
 */
async function insertContent(info: BlogInfo) {
    const col = await getCollection(dbInfo["colAssets"]);
    info["posted"] = localTime();
    const ret = col.insertOne(info);
    //return ret.finally(() => client.close());
    return ret;

}

// Find docs by `_id` descending,from mongoDB.
// Number of docs will be limited by `limit` parameter.
async function findBlogDocs(limit: number) {
    const col = await getCollection(dbInfo["colAssets"]);
    const ret = col.find().sort({ _id: -1 }).limit(limit).toArray();
    //return ret.then(ret => ret).finally(() => client.close());
    return ret;
}

// Homeのvisit回数を増やす
async function updateVisit() {
    const col = await getCollection(dbInfo["colVisits"]);
    const ret = col.updateOne({}, { $inc: { home: 1 } })
    return ret;
}

// update likes and dislikes
async function updateImpression(docId: string, likeCnt: number, dislikeCnt: number) {
    const col = await getCollection(dbInfo["colAssets"]);
    const ret = col.updateOne({ _id: new ObjectId(docId) }, { $inc: { likes: likeCnt, dislikes: dislikeCnt, views: 1 } });
    //return ret.finally(() => client.close());
    return ret;
}

// insert comment document to `comment` collection.
async function insertComment(name: string, comment: string, repId: number | null) {
    const col = await getCollection(dbInfo["colComment"]);
    const postTime = localTime();
    repId = repId || null;
    const maxNo = await col.count();
    const nextNo = maxNo + 1;
    const doc = {
        no: nextNo,
        posted: postTime,
        name: name,
        comment: comment,
        repId: repId,
    }
    const ret = col.insertOne(doc);
    //return ret.finally(() => client.close());
    return ret;
}

// commentドキュメントを取得
async function findCommentDocs(limit: number) {
    //await client.connect();
    const col = await getCollection(dbInfo["colComment"]);
    const ret = col.find().sort({ no: -1 }).limit(limit).toArray();
    //return ret.then(ret => ret).finally(() => client.close());
    return ret;
}

// assetsコレクションから所定のドキュメントを全て削除
// filterはmongodbに投げるフィルタ {"fieldName":"fieldValue"}
async function deleteManyAssets(filter: {}) {
    const col = await getCollection(dbInfo["colAssets"]);
    const ret = col.deleteMany(filter);
    return ret;
}

// *****************************************
// helper functions
// *****************************************

// don't forget to call client.close() after CRUD operation!
async function getCollection(collectionName: string) {
    // await client.connect();
    const dbName = dbInfo["db"];
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return collection;
}

function localTime() {
    return new Date().toLocaleString(undefined, { timeZone: "Asia/Tokyo" });
}


export {
    client, dbInfo, init, insertContent,
    findBlogDocs, updateImpression, insertComment,
    findCommentDocs, updateVisit, deleteManyAssets,
};