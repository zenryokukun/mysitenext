import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import notify from "../../lib/linenotify";
// export async function GET(req: NextRequest) {
//     const url = new URL("/blog", req.url)
//     const res = NextResponse.redirect(url);
//     console.log(res)
//     return res
// }

export async function GET(req: NextRequest) {

    const res = new NextResponse("hello,world", {
        headers: { "Content-Type": "text/plain" }
    });
    res.cookies.set("test", "123");
    notify("hello,world")
    return res;
}

export async function POST(req: NextRequest) {
    console.log("form submit");
    const url = new URL("/_home", req.url)
    return NextResponse.redirect(url)
}