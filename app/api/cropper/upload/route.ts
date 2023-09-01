/**
 * /production/cropperページで使用。
 * エンドポイント：[POST] /api/cropper/upload
 * bodyはFormData、content-typeはmultipart/form-data
 */

import path from "node:path";
import { writeFile, readFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { zipFiles } from "./zip";


export async function POST(req: NextRequest) {
    // bodyからform-dataを取得
    const formData = await req.formData();
    const ratio = formData.get("ratio");
    const resize = formData.get("resize");
    const width = formData.get("width");
    const pics = formData.getAll("pics") as File[];

    // パラメタが取得できない場合はエラー。widthはresizeがdefaultの場合は
    // nullになるのでチェックしない。
    if (!ratio || !resize) {
        return NextResponse.json(null, {
            status: 400,
            statusText: "Error: ratio,resize,width must be specified."
        })
    }

    // 画像ファイルがアップロードされていない場合エラー
    if (!pics || pics.length === 0) {
        return NextResponse.json(null, {
            status: 200,
            statusText: "Error: Could not find your file! Try again!"
        })
    }

    // フォルダー作成
    const folname = formattedDate();
    const projectPath = path.resolve();
    const savePath = path.join(projectPath, "py/pics", folname);
    const { status } = await makeFolder(savePath);

    if (status !== 0) {
        return NextResponse.json(null, { status: 400, statusText: `Error:Could not make folder:${savePath}` })
    }

    // フォルダーにpicsを保存
    const proms = [];
    for (const pic of pics) {
        // 作成したフォルダに、もともとのファイル名で保存する。
        const savePicPath = path.join(savePath, pic.name);
        // arrayBuffer型で取得し、Buffer型に変換。
        const ab = await pic.arrayBuffer();
        const buf = Buffer.from(ab);
        // ファイルに書き込む
        const prom = writeFile(savePicPath, buf);

        proms.push(prom);
    }

    // 全てのファイルの保存が終わったら、zipに圧縮しクライアントに返す。
    return await Promise.all(proms).then(async () => {
        // 圧縮処理。Pythonの圧縮処理を呼び出し、完了するまで待つ。
        const rcode = await zipFiles(savePath,
            ratio as string,
            resize as string,
            width as string
        );
        if (rcode !== 0) {
            return NextResponse.json(null, {
                status: 400,
                statusText: "Error: Could not zip image files."
            })
        }

        // クライントに圧縮したzipファイルを返す。
        const zipPath = savePath + ".zip";
        try {
            const buffer = await readFile(zipPath);
            // attachment; filenameのとこ、: -> ;に修正した。もしバグったら疑って。
            return new NextResponse(buffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/zip",
                    "Content-Disposition": "attachment; filename=zen-crop.zip"
                }
            });
        } catch (e) {
            console.log(e);
            return NextResponse.json(null, {
                status: 400,
                statusText: "Error: Could not send zipfile to client"
            })
        }
    });

}


/**
 * 1桁の数字を01,05のように２桁の数字にフォーマットする関数。
 * ２桁以上の数字の場合、単に文字列にして返す。
 * @param num 数字
 * @returns 二桁にフォーマットされた文字列
 */
function formatDigit(num: number): string {
    if (num < 10) {
        return '0' + num.toString();
    }
    return num.toString();
}


/**
 * 現在時刻をYYYY-MM-DD_HHMMSSの形式にフォーマットする関数
 * @returns 文字列
 */
function formattedDate(): string {
    const d = new Date();
    const year = d.getFullYear().toString();
    const month = formatDigit(d.getMonth() + 1);
    const date = formatDigit(d.getDate());
    const hour = formatDigit(d.getHours());
    const min = formatDigit(d.getMinutes());
    const sec = formatDigit(d.getSeconds());
    return year + month + date + "_" + hour + min + sec;
}


/**
 * パラメタで指定されたフォルダを作成する
 * @param savePath 作成するフォルダ名（フルパス）
 * @returns {status:int,data:string}
 */
async function makeFolder(savePath: string) {
    try {
        await mkdir(savePath);
        return { status: 0 }
    } catch (err) {
        return { status: 1, data: `failed to make folder :${savePath}` };
    }
}