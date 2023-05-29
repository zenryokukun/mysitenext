/**
 * 
 * [使用ページ] pages/production/md-converter
 * クライアントからアップロードされたmdファイルをremarkでパースして
 * html文字列でクライアントに返す。
 * 
 */
import multer from "multer";
import nextConnect from "next-connect";
import { formatMd } from "../../lib/util";
import { toHTMLString } from "../../lib/to-html-string";

import type { NextApiRequest, NextApiResponse } from "next";

// mutlerでRequestにfileプロパティが追加されるためRequestをカスタム。
interface CustomReq extends NextApiRequest {
  file: Express.Multer.File,
}

// クライアントからのアップロードファイル（1つ）を制御するミドルウェア
// アップロードファイルをRequestのfileプロパティに追加してくれる。
const FORM_NAME = "upload";
const upload = multer().single(FORM_NAME);

// リクエストを処理するハンドラ
const router = nextConnect({
  onError: (err: Error, req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Something went wrong! Try again.")
  },
  onNoMatch: (req: NextApiRequest, res: NextApiResponse) => {
    res.status(404).end("Not Found...Check your api-endpoint and http-method.")
  },
});

// アップロードファイルのチェック。mutlerの後に呼ぶこと。
function checker(req: CustomReq, res: NextApiResponse, next: () => void) {
  if (!req.file) {
    // mutlerがfileプロパティを追加できていない場合はエラー
    return res.status(400).end("Error! Something is wrong with your file! Try again!");
  }

  const fname = req.file.originalname; // ファイル名取得
  if (!fname || fname === "") {
    // file名が取得できない、空文字の場合はエラー
    return res.status(400).end("Error! Your file name was empty! Try again!");
  }
  if (!fname.endsWith(".md") && !fname.endsWith(".MD")) {
    // 拡張子が.mdでない場合はエラー
    return res.status(400).end("Error! Your file must end with `.md`! Try again!");
  }
  // エラーが無ければ次のミドルウェアへ！
  next();
}

router.use(upload);
router.post(checker, async (req: CustomReq, res: NextApiResponse) => {
  const buf = req.file.buffer; // fileの中身がbufferで入ってる
  const fileContent = buf.toString("utf-8"); // 文字列に変換
  const data = formatMd(fileContent); // gray-matterとcontentに分離
  // contetn部分のみ->html文字列に変換。gray-matter部分は切り捨てる。
  const html = await toHTMLString(data.content);
  res.send(html);
});


// multerを使ってmultipart/form-dataをパースするため、デフォルトのパーサは無効にする。
export const config = {
  api: {
    bodyParser: false,
  }
}

export default router;
