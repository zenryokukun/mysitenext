
/**
 * /api/cropper/upload　で使うmiddlewareをexport。
 * 
 * addTarget: 
 * 　　アップロードされたファイルの保存先フォルダを作成。
 * 　　req.targetに作成したフォルダのフルパスを設定
 * 
 * multiUpload:
 *    複数ファイルのアップロード（input type="fileでmultiple属性）した場合の、
 *    multipart/form-dataのパーサ
 * 
 */
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import multer from "multer";
import { makeFolder } from "./helper";

type Req = NextApiRequest & {
    target: string,
}

const TARGET_FOLDER = "pages/api/cropper/pics"
const FORM_NAME = "pics";

/**
 * pages/api/cropper/picsにYYYYMMDD_HHMMSSのフォルダを作成し、req.targetに設定する。
 * req.targetは後続のmiddlewareで使う。
 * @param req Request
 * @param res Response
 * @param next call next middleware
 * @returns void
 */
async function addTarget(req: Req, res: NextApiResponse, next: () => void) {
    const root = path.join(path.resolve(), TARGET_FOLDER);
    const fol = await makeFolder(root);
    if (fol.status !== 0) {
        return res.send(fol.data);
    }
    req.target = fol.data;
    next();
}


// StorageEngine.保存先、保存ファイル名を設定。
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        //@ts-ignore
        cb(null, req.target);
    },
    filename: function (req, file, cb) { cb(null, file.originalname); },
});

// multipart/form-dataのパーサmiddleware。
// formにmultiple属性がついている場合のパーサを使う。
const _upload = multer({ storage: storage });
const multiUpload = _upload.array(FORM_NAME);

export { addTarget, multiUpload };