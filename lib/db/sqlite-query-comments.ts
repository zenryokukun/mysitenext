import client from "./sqlite-client";
import type { Result, NewCommentsRec } from "./sqlite-types";

/**
 * 新版のコメントを取得する関数。api/board/getlistで使用
 * @TODO selectは使ってないので消す。
 * @TODO 全量取得しているので、量増えたらトピックごとに抽出することも検討
 * @TODO トピック投稿と、内容投稿でDB分けることも検討。増えてきたら。
 * @param limit 
 * @param select 使ってないので消す
 * @returns 
 */
export function getNewComments(limit: number = 999, select = undefined) {
    return new Promise<NewCommentsRec[]>((res, rej) => {
        client.all(`SELECT * FROM NEW_COMMENTS`, (err, rows: NewCommentsRec[]) => {
            if (err) rej(err);
            if (rows.length > limit) {
                rows = rows.slice(-limit);
            }
            res(rows);
        });
    });
}


interface NewCommentProp {
    name: string;
    msg: string;
    // 親スレッドのID。新規スレッドの場合はnull。
    parentSeq: number | null;
    topic: string;
}
interface TargetSeqs {
    targetThreadSeq: number | null;
    targetReplySeq: number | null;
}

/**
 * @TODO THREAD_SEQの最大値より大きなparentSeqがクライアントから渡された場合、
 * 　　　 parentSeqがそのまま登録され、REPLY_SEQがnullでなく1で設定される。
 *       画面操作からは発生しないが、気になるようならチェックを検討。
 * @param NewCommentProp
 * @returns {Promise<Result>}
 */
export function insertNewComment({ name, msg, parentSeq, topic }: NewCommentProp) {
    // parentSeqが渡されている場合、threadSeqを設定。
    let threadSeq = parentSeq || null;

    return new Promise<number | null>((res, rej) => {
        // 既存スレッドの場合、パラメタのthreadSeqをそのまま使う
        if (threadSeq !== null) {
            return res(threadSeq);
        }
        // 新スレッドの場合、全レコードのthread_seqを計算し、＋１した値で解決する。
        // thread_seqがnullの場合最初のレコードなので１で解決。
        client.get(`SELECT MAX(THREAD_SEQ) as tseq FROM NEW_COMMENTS`, (err, row: { tseq: number | null }) => {
            if (err) rej(err);
            const nextThreadSeq = row.tseq !== null ? row.tseq + 1 : 1;
            res(nextThreadSeq);
        });
    }).then(targetThreadSeq => {
        return new Promise<TargetSeqs>((res, rej) => {
            if (threadSeq === null) {
                // 新スレッドの場合。
                // 前のpromiseで取得した新スレッドSEQで解決。
                // 初書き込みでreplyはないため、reply_seqはnull。
                return res({ targetThreadSeq, targetReplySeq: null });
            }

            // 既存スレッドの場合、THREAD_SEQがtargetThreadSeqと等しいレコードのうち、
            // 最大のREPLY_SEQを取得する。＋１した値で解決する。
            // REPLY＿SEQがnullの場合、初返信のため1で解決。
            const param = { $tseq: targetThreadSeq };
            const onCompleted = (err: Error | null, row: { rseq: number | null }) => {
                if (err) rej(err);
                const targetReplySeq = row.rseq !== null ? row.rseq + 1 : 1;
                res({ targetThreadSeq, targetReplySeq });
            }

            client.get(`
                SELECT MAX(REPLY_SEQ) as rseq 
                FROM NEW_COMMENTS
                WHERE THREAD_SEQ=$tseq`,
                param,
                onCompleted
            );

        });

    }).then(targetSeqs => {

        return new Promise<Result>((res, rej) => {

            const { targetThreadSeq, targetReplySeq } = targetSeqs;

            const params = {
                $tseq: targetThreadSeq,
                $rseq: targetReplySeq,
                $pseq: parentSeq,
                $topic: topic,
                $name: name,
                $msg: msg,
                $posted: new Date().toLocaleString(),
            }

            const onCompleted = (err: Error | null) => {
                if (err) rej(err);
                res({ acknowledged: true });
            };

            client.run(`
                INSERT INTO NEW_COMMENTS (
                    THREAD_SEQ,REPLY_SEQ, PARENT_SEQ,TOPIC,
                    NAME,MSG,POSTED
                ) 
                VALUES (
                    $tseq, $rseq, $pseq, $topic,
                    $name, $msg, $posted
                )`, params, onCompleted);
        });
    });
}