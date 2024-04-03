import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Admin from "./Admin";
import { isAdmin } from "../../lib/db/admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "全力ブログ・システム",
    description: "管理者ページ",
};


export default async function Page() {
    // cookieから`user`の値を取得し、管理者かチェックする。
    // 管理者なら/adminページに進み、以外なら/loginにリダイレクトする
    const cookie = cookies();
    // cookie.get("name")は、{"name":string,"value":string}の型で返すので注意。
    // valueだけ返してくれ～～！
    const auth = cookie.get("user")

    // cookieが取得できない場合リダイレクト
    if (!auth) {
        return redirect("/login");
    }
    // 認証できない場合もリダイレクト
    if (!(await isAdmin(auth.value))) {
        return redirect("/login");
    }
    // OKらAminをレンダリング
    return <Admin />;
}