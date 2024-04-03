import path from "node:path";
import { verbose } from "sqlite3";
import type { Database } from "sqlite3";

const sqlite3 = verbose();

declare global {
    var _sqlite_client: Database
}

function dbConnectHandler(err: Error | null) {
    if (err) throw new Error("db open failed");
}

// sqlite3 dbのフルパス
const dbpath = path.join(path.resolve(), "nextblog.db");

let client: Database;

if (process.env.NODE_ENV === "production") {
    client = new sqlite3.Database(dbpath, dbConnectHandler)
} else {
    // 本番でないとき、hot-reloadで再接続しないように対策。
    // global変数にclientPromiseを設定しておき、
    // 設定がされている場合は、再接続せずに使いまわす。
    if (!global._sqlite_client) {
        global._sqlite_client = new sqlite3.Database(dbpath, dbConnectHandler);
    }
    client = global._sqlite_client;
}

export default client;