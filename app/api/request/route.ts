/**
 * Requestコンポーネントから呼び出す。
 * Formで入力された要望を、linenotifyで通知する。
 */

import notify from "../../../lib/linenotify";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface Body {
  msg?: string;
}

export async function POST(req: NextRequest) {

  const { msg } = await req.json() as Body;

  // msgが取得できない場合はエラーにする
  if (msg === undefined) {
    return NextResponse.json(null, {
      status: 400,
      statusText: "invalid input value",
    })
  }

  // エラーがなければlinenotifyする
  notify(msg);

  // 正常終了を返す
  return NextResponse.json(null, { status: 200 })
}