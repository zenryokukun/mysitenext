/* 
  /production/md-converterで利用。form-dataでファイルを１つ受け取る。
  formのnameは`upload`。requestのmimeはmultipart-formdataになる
*/

import { NextRequest, NextResponse } from "next/server";
import { formatMd } from "../../../lib/util";
import parseMd from "../../../lib/parse-md";
// import { toHTMLString } from "../../../lib/to-html-string";

export async function POST(req: NextRequest) {

    // form名
    const formName = "upload";

    // bodyをFormDataにパース
    const data = await req.formData();

    // formNameのvalue(File型)を取得。
    // fileは1つしかアップロードされないため、getでOK。
    const file = data.get(formName) as File;

    // fileが取得できない場合はエラー
    if (!file) {
        return NextResponse.json(null, { status: 400, statusText: "Error! Something is wrong with your file! Try again!" })
    }

    // file名が取得できない、空文字の場合はエラー
    const fileName = file.name;
    if (!fileName || fileName === "") {
        return NextResponse.json(null, { status: 400, statusText: "Error! Your file name was empty! Try again!" })
    }

    // 拡張子が.md .MD以外ならエラー
    if (!fileName.endsWith(".md") && !fileName.endsWith(".MD")) {
        return NextResponse.json(null, { status: 400, statusText: "Error! Your file must end with `.md`! Try again!" })
    }

    // アップロードされたファイルをhtmlに変換し、clientに返す。
    const content = await file.text()
    const matter = formatMd(content);
    const html = await parseMd(matter.content)
    // const html = await toHTMLString(matter.content)
    return new NextResponse(html, { status: 200, headers: { "Content-Type": "text/html" } })
}