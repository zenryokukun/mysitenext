/**
 * MONGODB -> SQLITE3への移行で新設
 * - 関数名は変えない
 * - パラメタははなるべく変えない
 * - DBの型の変換は面倒（sqlite3はDate型の日付が無かったり、、）ため、キャストはしない
 * - sqlite3のライブラリがコールバック式のため、Promise化する
 */

import client from "./sqlite-client";
import type { AssetsRec } from "./sqlite-types";
import type { BlogInfo, UpdateItem, UpdateItemRequest } from "../../types";
import type { Result } from "./sqlite-types";

/**
 * ASSETSテーブルからblogの一覧documentを取得する。
 * limitはSQLでlimitを切るのではなく、全種抽出後にlimit分に切っているので、必要であればなおす。
 * @param limit 抽出上限
 * @returns {Promise<AssetsRec[]>}
 */
export function findBlogDocs(limit: number = 999) {
    return new Promise<AssetsRec[]>((res, rej) => {
        client.all(`SELECT * FROM ASSETS`, (err, rows: AssetsRec[]) => {
            if (err) rej(err);
            if (rows.length > limit) {
                rows = rows.slice(-limit);
            }
            res(rows);
        });
    });
}

/**
 * /post/[dir]/page.tsxでMDブログページの生成に使用。
 * [dir].tsxのパス一覧取得用。mongodbのassetsコレクションのassetsDirフィールドのみ一覧で返す
 * assetsコレクションには.mdと.mdx両方入っているが、.mdのみ一覧で返す。
 * @returns {Promise<string[]>}
 */
export function getMDBlogDirList() {
    return new Promise<string[]>((res, rej) => {
        client.all(`SELECT DIR FROM ASSETS WHERE MD LIKE '%.md'`, (err, rows: { DIR: string }[]) => {
            if (err) rej(err);
            const dirlist = rows.map(v => v.DIR);
            res(dirlist);
        })
    });
}

/**
 * client.getで１レコードしか返さない前提なので注意。
 * sqlの検索がヒットしない場合、rowはundefinedになる。
 * @param field 抽出するカラム
 * @param value 抽出するカラムの値 
 * @returns {Promise<AssetsRec|undefined>}
 */
export function findByField(field: string, value: string | number) {
    return new Promise<AssetsRec | undefined>((res, rej) => {
        client.get(`SELECT * FROM ASSETS WHERE ${field} = $value`, {
            $value: value,
        }, (err, row: AssetsRec | undefined) => {
            if (err) rej(err);
            res(row);
        });
    });
}

/**
 * keywordsで指定したキーワードのいずれかを、ASSETS.KEYWORDSに含むレコードを抽出する。
 * @TODO db.eachで一行ずつ取得してる。時間かかるようなら全量selectして抽出する方式に変える。 
 * @param keywords 抽出するキーワードのリスト
 * @returns {Promise<AssetsRec[]>}
 */
export function findMatched(keywords: string[]) {
    // keywordsのいずれかの値ががKEYWORDS列のいずれかにマッチしたレコードを格納する変数
    const recs: AssetsRec[] = [];

    return new Promise<AssetsRec[]>((res, rej) => {
        // #eachメソッドで抽出された各rowに対して実行する関数。
        // keywordsパラメタのいずれかの値がKEYWORDS列に存在する場合、recsに追加する関数
        const onMatched = (err: Error | null, row: AssetsRec) => {
            if (!row) return;
            const kwCol = row.KEYWORDS.split(",");
            for (const keyword of keywords) {
                if (kwCol.includes(keyword)) {
                    // 重複排除処理。["html","css"]のように複数キーワードが設定されている場合で
                    // パラメタが["html","keyword"]の場合、同じ記事でもそれぞれヒットしてしまうため。
                    let isExist = false;
                    for (const rec of recs) {
                        if (rec.DIR === row.DIR) {
                            isExist = true;
                            break;
                        }
                    }
                    // まだヒットしていない記事の場合のみ、recsに追加。
                    if (isExist === false) {
                        recs.push(row);
                    }
                }
            }
        }

        // #eachが全て終わった後に実行される関数。promiseをresで解決させる
        const onCompleted = (err: Error | null, rows: AssetsRec[]) => {
            if (err) rej(err)
            res(recs)
        };

        client.each(`SELECT * FROM ASSETS`, onMatched, onCompleted);
    });
}

/**
 * /api/admin/upload　で使用
 * ブログ情報をDBに登録。pages/blogの一覧を取得するのに利用。
 * @param info 
 * @returns 
 */
export function insertBlogInfo(info: BlogInfo) {

    return new Promise<Result>((res, rej) => {

        const onCompleted = (err: Error | null) => {
            if (err) rej(err);
            res({ acknowledged: true });
        };

        client.run(`
            INSERT INTO ASSETS (
                GENRE,
                DIR,
                TITLE,
                SUMMARY,
                THUMB,
                MD,
                LIKES,
                DISLIKES,
                VIEWS,
                POSTED,
                FIRST_POSTED_DATE,
                KEYWORDS
            ) VALUES (
                $genre,
                $dir,
                $title,
                $summary,
                $thumb,
                $md,
                $likes,
                $dislikes,
                $views,
                $posted,
                $firstPostedDate,
                $keywords
            )
        `, {
            $genre: info.genre,
            $dir: info.assetsDir,
            $title: info.title,
            $summary: info.summary,
            $thumb: info.thumb,
            $md: info.md,
            $likes: info.likes,
            $dislikes: info.dislikes,
            $views: info.views,
            $posted: info.posted,
            $firstPostedDate: info.firstPostedDate,
            $keywords: info.keywords?.join(","),
        }, onCompleted)
    });
}

/**
 * /api/admin/update-oneで使用。登録済ブログ情報を一部更新可能
 * 更新可能なカラム：GENRE, TITLE, SUMMARY, KEYWORDS
 * @param item 
 * @returns 
 */
export async function updateBlogInfo(item: UpdateItemRequest) {
    const { updateKey, data } = item;
    const { assetsDir } = updateKey;
    // どのカラムが更新されるかは不明なので、更新されない値はDBから取得し、同じ値で更新。
    const rec = await findByField("DIR", assetsDir);
    const param = {
        $genre: data.genre || rec?.GENRE,
        $title: data.title || rec?.TITLE,
        $summary: data.summary || rec?.SUMMARY,
        $keywords: data.keywords ? data.keywords.join(",") : rec?.KEYWORDS,
        $assetsDir: assetsDir,
    };
    // 更新処理
    return new Promise<Result>((res, rej) => {
        const onCompleted = (err: Error | null) => {
            if (err) rej(err);
            res({ acknowledged: true });
        };
        client.run(`
            UPDATE ASSETS 
            SET GENRE = $genre,TITLE = $title,SUMMARY = $summary,KEYWORDS = $keywords
            WHERE DIR = $assetsDir
        `, param, onCompleted);
    });
}

interface UpdateKey {
    // 実質{assetsDir:string}しかあり得ない。
    [key: string]: string;
}
interface UpdateMDX {
    genre: string;
    title: string;
    summary: string;
    thumb: string;
    keywords: string[];
    posted: string;
}
/**
 * MDXの更新処理。/api/admin/uploadで使用。
 * MDXの場合はDBの更新処理がある。MDの場合は削除→挿入にしている。MDXはgray-matterの日付を設定していないため、削除すると初回投稿日が取得できなくなるので更新処理にした（当時）。
 * @TODO /api/admin/uploadで、MDとMDXで同じ関数を使うように修正することも検討
 * @param key 実質{ assetsDir: string }でしか使っていないため、その想定で実装。他のパラメタは使えないので注意。後方互換のためmongodbと型はそろえてある。
 * @param data genre,title,summary,thumb,keywords,postedの全ての値が設定されている想定で実装している。
 * @returns 
 */
export function updateMDXBlogInfo(key: UpdateKey, data: UpdateMDX) {
    const sql = `
        UPDATE ASSETS 
        SET GENRE=$genre, TITLE=$title, SUMMARY=$summary,
            THUMB=$thumb, KEYWORDS=$keywords, POSTED=$posted
        WHERE DIR=$assetsDir
    `
    const param = {
        $genre: data.genre,
        $title: data.title,
        $summary: data.summary,
        $thumb: data.thumb,
        $keywords: data.keywords.join(","),
        $posted: data.posted,
        $assetsDir: key.assetsDir,
    };

    return new Promise<Result>((res, rej) => {
        const onCompleted = (err: Error | null) => {
            if (err) rej(err);
            res({ acknowledged: true })
        };
        client.run(sql, param, onCompleted)
    })
}

/**
 * /api/admin/update で使用。  
 * filterで指定したレコードを削除する。
 * mdファイルの場合、上書きは削除→挿入で行っている。削除部分を担う関数。
 * @param filter 削除するDIRカラム
 * @returns 
 */
export function deleteDuplicateDir(filter: { assetsDir: string }) {
    return new Promise<Result>((res, rej) => {
        const onCompleted = (err: Error | null) => {
            if (err) rej(err);
            res({ acknowledged: true });
        }
        client.run(`
            DELETE FROM ASSETS WHERE DIR=$assetsDir
        `, { $assetsDir: filter.assetsDir }, onCompleted);
    });
}

/**
 * mongodb時代のバックアップを取得する関数。
 * sqlite3はそもそもファイルベースなので、今の時点ではバックアップ不要。
 * @TODO　削除するなり、別のバックアップ方法を検討。
 * 互換保持のため残す。
 */
export async function backupAssetsCollection() {
    // 何もしない。
    return;
}

/**
 * /api/post/like で利用
 * dirと一致するレコードのlikeを1インクリメント
 * @param {dir:string}
 * @returns 
 */
export function updateLike({ dir }: { dir: string }) {

    if (!dir) return;

    return new Promise<{ LIKES: number }>((res, rej) => {
        // 現在のlikeの数を取得
        client.get(`SELECT LIKES FROM ASSETS WHERE DIR=$dir`, { $dir: dir }, (err, row: { LIKES: number }) => {
            if (err) rej(err);
            res(row);
        });
    }).then((row) => {
        // 1足してUPDET
        const likes = row.LIKES + 1;
        const params = { $likes: likes, $assetsDir: dir }
        return new Promise<Result>((res, rej) => {
            client.run(`UPDATE ASSETS SET LIKES=$likes WHERE DIR=$assetsDir`, params, (err) => {
                if (err) rej(err);
                res({ acknowledged: true })
            });
        })
    });
}

/**
 * _app.tsxで使用。遷移するページの訪問数を更新する。
 * NODE_ENVがproductionの時のみ呼ばれる。
 * が、もういらない機能なので後方互換用に何もしない関数として残す、、
 * @TODO 削除対応を検討
 * @param dir 
 * @returns 
 */
export function updateVisit(dir: string) {
    return;
}