import client from "./sqlite-client";
import type { TutorialRec, Result } from "./sqlite-types";

export function getTutorials() {
    return new Promise<TutorialRec[]>((res, rej) => {
        client.all(`SELECT * FROM TUTORIAL`, (err, rows: TutorialRec[]) => {
            if (err) rej(err);
            res(rows);
        });
    });
}

export function findTutorialBySlugs(slugs: string) {
    return new Promise<TutorialRec>((res, rej) => {
        client.get(`SELECT * FROM TUTORIAL WHERE SLUGS=$slugs`, { $slugs: slugs }, (err, row: TutorialRec) => {
            if (err) rej(err);
            res(row);
        })
    });
}

export function insertTutorial(args: TutorialRec) {
    return new Promise<Result>((res, rej) => {
        const param = {
            $slugs: args.SLUGS,
            $spath: args.SYSTEM_PATH,
            $category: args.CATEGORY,
            $fname: args.FILENAME,
            $title: args.TITLE,
            $desc: args.DESCRIPTION,
            $author: args.AUTHOR,
            $published: args.PUBLISHED,
            $updated: args.UPDATED,
            $prev: args.PREV,
        }
        client.run(`
            INSERT INTO TUTORIAL (
                SLUGS,SYSTEM_PATH,CATEGORY,
                FILENAME,TITLE,DESCRIPTION,
                AUTHOR,PUBLISHED,UPDATED,
                PREV
            )
            VALUES (
                $slugs,$spath,$category,
                $fname,$title,$desc,
                $author,$published,$updated,
                $prev
            )
        `, param, (err) => {
            if (err) rej(err);
            res({ acknowledged: true })
        })
    })
}

interface UpdateTutorialRec extends TutorialRec {
    // slugsは更新条件。一方、更新される可能性もあるため、
    // DB登録値を更新条件とする必要がある。
    // DB登録値↓
    DBSLUGS: string;
}
export function updateTutorial(rec: UpdateTutorialRec) {
    return new Promise<Result>((res, rej) => {
        const param = {
            $slugs: rec.SLUGS,
            $spath: rec.SYSTEM_PATH,
            $category: rec.CATEGORY,
            $fname: rec.FILENAME,
            $title: rec.TITLE,
            $desc: rec.DESCRIPTION,
            $author: rec.AUTHOR,
            $published: rec.PUBLISHED,
            $updated: rec.UPDATED,
            $prev: rec.PREV,
            $dbslugs: rec.DBSLUGS,
        };
        console.log(rec);
        client.run(`
            UPDATE TUTORIAL
            SET SLUGS = $slugs,
                SYSTEM_PATH = $spath,
                CATEGORY = $category,
                FILENAME = $fname,
                TITLE = $title,
                DESCRIPTION = $desc,
                AUTHOR = $author,
                PUBLISHED = $published,
                UPDATED = $updated,
                PREV = $prev
            WHERE SLUGS = $dbslugs
        `, param, err => {
            console.log(err);
            if (err) rej(err);
            res({ acknowledged: true });
        });
    });
}