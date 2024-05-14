import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdmin } from "../../../lib/db/admin";
import Admin from "./Admin";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "全力チュートリアル・システム",
    description: "チュートリアル更新用の管理者ページ",
};

/**
 * 認証の仕組みは/adminページと同じ。そちらのコメント参照
 */
export default async function Page() {

    const cookie = cookies();
    const auth = cookie.get("user");

    if (!auth) {
        return redirect("/login");
    }

    if (!(await isAdmin(auth.value))) {
        return redirect("/login");
    }

    return <Admin />;
}