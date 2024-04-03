import { getAdmin } from "./sqlite-query-admin";
import { genSessionId } from "../util";

/**
 * /api/loginで使用。
 * testIdとtestPwを検証し、db登録値と一致する場合はsessionIDを生成して返す。
 * @param testId テストするID
 * @param testPw テストするPASSWORD
 * @returns
 */
export async function authenticate(testId: string, testPw: string) {
    const { id, password } = await getAdmin();

    // DBから値の取得ができない場合は認証しない
    if (!id || !password) {
        return { ok: false, session: "" };
    }

    // 入力されたIDが不正の場合は認証しない
    if (id !== testId) {
        return { ok: false, session: "" };
    }

    // 入力されたPASSWORDが不正の場合は認証しない
    if (password !== testPw) {
        return { ok: false, session: "" };
    }

    // idとパスワードが一致。sessionIDを生成して返す。
    const sid = genSessionId({ id: testId, password: testPw });
    return { ok: true, session: sid };
}


/**
 * /adminページで行うナンチャッテ認証。
 * 認証が必要なページで、cookieに登録されたsessionIDが正しいかチェックする。
 * @param testStr ookieに設定された認証用文字列
 * @returns 
 */
export async function isAdmin(testStr: string) {
    const { id, password } = await getAdmin();
    // DBから値の取得ができない場合は認証しない
    if (!id || !password) {
        return false;
    }
    // 正しいセッションID
    const correctStr = genSessionId({ id, password });
    return testStr === correctStr;
}