import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "../../../lib/db/func";

interface Identifier {
    user: string;
    password: string;
}

export async function POST(req: NextRequest) {

    // json形式でbodyがセットされている。{user:string,password:string}の型
    const identifier = await req.json() as Identifier
    const { user, password } = identifier;

    // userとpasswordが定義されていなかったらエラー。想定外だがログでエラーになっていたので。
    if (!user || !password) {
        return new NextResponse(
            `user and password are not defined. user:${user} password:${password}`,
            {
                status: 400,
                statusText: "user and password are not defined."
            }
        )
    }

    // userとpasswordが入力されていなかったらエラー
    if (user.length === 0 || password.length === 0) {
        return new NextResponse(
            "user and password are required!",
            {
                status: 400,
                statusText: "user and password are required!"
            })
    }

    // 認証
    const { ok, session } = await authenticate(user, password);
    if (!ok) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    // 下記のようなredirectはApp Routerだと"use client"してもページ遷移してくれない。
    // 厳密には、clientのfetchでデータ取得までしてくれる（textで遷移先ページのhtmlは取得できている）がレンダリングはしてくれない。
    // const res = NextResponse.redirect(new URL("/admin", req.url));

    // そのため、遷移先urlをjsonで返し、clientでナビゲートさせる。
    const res = NextResponse.json({ url: "/admin" }, { status: 200 });
    res.cookies.set("user", session); // cookieセットを忘れずに
    return res;
}