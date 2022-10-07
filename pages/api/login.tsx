import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { authenticate } from "../../lib/db/func";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { user, password } = req.body;
    const { ok, session } = await authenticate(user, password);
    if (!ok) {
        return res.status(401).send("Unauthorized");
    }
    // 認証OKならcookieをセットして/adminページにリダイレクト
    // adminのgetServerSidePropsでcookieチェックする
    // optionの{path:"/"}を設定しないとgetServerSidePropsでcookieの取得できないので、必要。
    res.setHeader("Set-Cookie", serialize("user", session, { path: "/", httpOnly: true, }));
    res.redirect("/admin");
}