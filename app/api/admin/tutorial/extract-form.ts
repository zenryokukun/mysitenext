/**
 * /admin/tutorialのformDataを抜き出し、
 * TutorialRec型で返すヘルパー関数
 */
export default function extract(fd: FormData) {
    const SLUGS = fd.get("slugs") as string;
    const SYSTEM_PATH = fd.get("systemPath") as string;
    const CATEGORY = fd.get("category") as string;
    const FILENAME = fd.get("filename") as string;
    const TITLE = fd.get("title") as string;
    const DESCRIPTION = fd.get("description") as string;
    const AUTHOR = fd.get("author") as string;
    const PREV = fd.get("prev") as string;
    // disabledだとnullになる可能性あり。
    let PUBLISHED = fd.get("published") as string | null;
    let UPDATED = fd.get("updated") as string | null;
    // nullもしくは空文字の場合は現在日付を入れる
    if (!PUBLISHED || PUBLISHED === "") {
        PUBLISHED = new Date().toLocaleString();
    }
    // 更新日付は未入力もありうる。未入力の場合は空文字にしておく。
    if (!UPDATED) {
        UPDATED = "";
    }
    return {
        SLUGS, SYSTEM_PATH, CATEGORY, FILENAME, TITLE,
        DESCRIPTION, AUTHOR, PUBLISHED, UPDATED,
        PREV,
    };
}