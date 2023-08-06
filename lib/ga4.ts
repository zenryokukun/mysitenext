/**
 * Google Analytics Data APIを実行するスクリプト
 * ビルド時のみに利用する想定
 */

import path from 'node:path';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

// ga4のpropertyid
const propertyId = '328060753';

// api利用するには、環境変数GOOGLE_APPLICATION_CREDENTIALSに認証ファイルのパスを設定する必要がある。
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(path.resolve(), 'lib/cred', 'ga4.json');

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const client = new BetaAnalyticsDataClient()

/**
 * 前月のscreenPageViews数の多い記事（/post直下）をlimit数返す。
 * [dir1,dir2,dir3]の配列の形で結果を返す。
 * @param limit なん個返すか
 */
export async function popularDir(limit: number = 3) {
    // 前月のページ別ビュー数を取得、結果は既にビュー数の降順にソートされている。
    const rows = await runReport();

    if (!rows) throw new Error("Could not get data: ga4 runReport");

    const dirs: string[] = [];

    // 全ページ分のビュー数が入っているので、/post直下のページ（記事）一覧に絞る
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.dimensionValues) continue;
        const url = row.dimensionValues[0].value;
        if (!url) continue;
        // urlを'/'で分割し、post直下に絞る
        const parts = url.split('/');
        // 長さ2以下なら処理なし
        if (parts.length < 2) continue;
        // お尻２つを抽出し、先頭がpostなら記事。
        const cand = parts.slice(-2);
        if (cand[0] !== "post") continue;
        dirs.push(cand[1]);
    }

    // limitに絞る。降順になっているので、先頭からlimit数分を返せばOK。
    return dirs.slice(0, limit);
}

/**
 * GA4 APIを使って前月1か月間のfullPageUrl単位のscreenPageViews数を返す。
 * @returns google.analytics.data.v1beta.IRunReportResponse.rows?: google.analytics.data.v1beta.IRow[] | null | undefined 
 */
async function runReport() {
    const [first, last] = getPrevDateRange();
    const param = {
        property: `properties/${propertyId}`,
        dateRanges: [
            { startDate: first, endDate: last },
        ],
        dimensions: [
            { name: 'fullPageUrl' },
        ],
        metrics: [
            { name: 'screenPageViews' },
        ],
    };

    const [response] = await client.runReport(param);
    return response.rows;
}

/**
 * Formats Date object to 'YYYY-MM-DD' string format.
 * @param dateObj Date
 * @returns 
 */
function formatDate(dateObj: Date) {
    // 全てNumber型なのに注意
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // 0～11で表現されるので＋１
    const date = dateObj.getDate();
    // ここで文字列に変換。二桁に揃えるため、10未満は先頭に'0'を付与。
    const yearStr = year.toString();
    const monthStr = month < 10 ? '0' + month.toString() : month.toString();
    const dateStr = date < 10 ? '0' + date.toString() : date.toString();
    return yearStr + '-' + monthStr + '-' + dateStr;
}

/**
 * 前月初日と末日をYYYY-MM-DD形式で返す
 * @returns [string,string]
 */
function getPrevDateRange(): [string, string] {
    const prevFirst = new Date()
    // setDateに0を渡すと前月の最終日を返す仕様
    prevFirst.setDate(0)
    // そこから日付に1をセットすれば、月の最初の日になる
    prevFirst.setDate(1);
    const prevLast = new Date()
    prevLast.setDate(0);
    return [formatDate(prevFirst), formatDate(prevLast)];
}