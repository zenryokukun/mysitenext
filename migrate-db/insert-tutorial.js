const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

/**
 * paths.jsonのレコード情報
 * @typedef {Object} Tutorial
 * @property {string} slugs urlのディレクトリ部分。カンマ区切り。[common,command-line,usage]
 * @property {string} systemPath 資材が配置されているPC上のパス
 * @property {string} category 分類
 * @property {string} filename ファイル名。page.md
 * @property {string} title ページのタイトル
 * @property {string} description ページのmeta description
 * @property {string} author 作者名
 * @property {string} published 投稿日
 * @property {string} updated 更新日
 * @property {string} prev 「前」の記事のid。順番にこだわりたい時に使う想定。
 * 
 */

// プロジェクトのルート・ディレクトリから実行する想定でパスを構築
const root = path.resolve()
const pathFile = path.join(root, "migrate-db", "paths.json");
const dbFile = path.join(root, "dbfile", "nextblog.db");
const db = new sqlite3.Database(dbFile);

function insert() {
    fs.readFile(pathFile, { encoding: "utf-8" }, (err, data) => {
        if (err) {
            // console.error(err);
            throw new Error(err);
        }
        /**@type {Tutorial[]}*/
        const params = JSON.parse(data);

        const stmt = db.prepare(`
            INSERT INTO TUTORIAL 
            (
                SLUGS,SYSTEM_PATH,CATEGORY,FILENAME,TITLE,
                DESCRIPTION,AUTHOR,PUBLISHED,UPDATED,PREV
            ) 
            VALUES 
            (
                $slugs,$systemPath,$category,$filename,$title,
                $desc,$author,$published,$updated,$prev
            )
        `)

        for (const param of params) {
            const placeholder = {
                $slugs: param.slugs.join(","),
                $systemPath: param.systemPath,
                $category: param.category,
                $filename: param.filename,
                $title: param.title,
                $desc: param.description,
                $author: param.author,
                $published: param.published.length === 0 ? new Date().toLocaleString() : param.published,
                $updated: param.updated,
                $prev: param.prev,
            }
            stmt.run(placeholder, err => {
                if (err) {
                    console.error(err);
                    throw new Error(err);
                }
            })
        }

        stmt.finalize();
    })
}

insert()