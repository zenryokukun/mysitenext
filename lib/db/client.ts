import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));

declare global {
    var _client: Promise<MongoClient>
}

interface DbInfo {
    "url": string,
    "db": string,
    "colAssets": string,
    "colComment": string,
    "colVisits": string,
}


let client: MongoClient | undefined = undefined;
let clientPromise: Promise<MongoClient>

const content = readFileSync(path.join(here, "dbinfo.json"), { encoding: "utf-8" });
const dbInfo: DbInfo = JSON.parse(content);

if (process.env.NODE_ENV === "production") {
    client = new MongoClient(dbInfo.url);
    clientPromise = client.connect();
} else {
    if (!global._client) {
        client = new MongoClient(dbInfo.url);
        global._client = client.connect();
    }
    clientPromise = global._client;
}

function onexit() {
    if (client) {
        client.close();
    }
}

function onsigint() {
    process.exit();
}

//hot reloadの場合だとイベントがreloadの都度追加されるので消しとく
process.removeListener("exit", onexit);
process.removeListener("SIGINT", onsigint);

// exitした場合のEventEmitter
process.on("exit", onexit);
// ctrl + c でキャンセルした場合のEventEmitter
process.on("SIGINT", () => onsigint);


// 返すのはプロミスなので利用するときにawaitすること。
// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
export { dbInfo };
