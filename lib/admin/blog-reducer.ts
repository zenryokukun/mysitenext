/**
 * /pages/admin.tsxが大きくなったのでロジック部分をreducerとして分離。
 * Blogコンポーネントで利用。
 */

/*******************************************************
 * Blogコンポーネントのreducer
 *******************************************************/

export interface BlogItemState {
    // ユーザ入力値
    titleInput: string;
    summaryInput: string;
    genreInput: string;
    keywordsInput: string;
    // 入力値の変更フラグ
    isTitleChanged: boolean;
    isSummaryChanged: boolean;
    isGenreChanged: boolean;
    isKeywordsChanged: boolean;
}

export const ACTIONS = {
    INIT: 0, // 初期処理。useReducer時に初期stateを入れるので、使ってない。
    TITLE: 1, // title変更
    SUMMARY: 2, // summary変更
    GENRE: 3, // genre変更
    KEYWORDS: 4, //keywords変更
    UNDO: 5, // db値に全て戻す
    UN_COLOR: 6, // 色を元に戻す
}

export interface Action {
    type: number;
    payload: {
        // ユーザ入力値
        titleInput?: string,
        summaryInput?: string,
        genreInput?: string,
        keywordsInput?: string,
        // dbの値
        dbTitle?: string,
        dbSummary?: string,
        dbGenre?: string,
        dbKeywords?: string,
    }
}

export function blogItemReducer(state: BlogItemState, action: Action) {
    // switch内でscopeが形成され、case間で同じ変数名の宣言が出来ない、、、
    // そのためここで共通の変数として宣言。いずれか1つのcaseしか実行されないので処理に影響はない。
    const { payload } = action;
    const { titleInput, summaryInput, genreInput, keywordsInput } = payload;
    const { dbTitle, dbSummary, dbGenre, dbKeywords } = payload

    let isChanged: boolean;

    switch (action.type) {
        case ACTIONS.INIT:
            return {
                titleInput: titleInput || "",
                summaryInput: summaryInput || "",
                genreInput: genreInput || "",
                keywordsInput: keywordsInput || "",
                isTitleChanged: false,
                isSummaryChanged: false,
                isGenreChanged: false,
                isKeywordsChanged: false,
            };

        case ACTIONS.TITLE:
            /**
             * jsでは空文字（""）を評価するとfalseになる点に留意。。。
             */
            if (titleInput === undefined || dbTitle === undefined) return state;
            isChanged = titleInput !== dbTitle;
            return {
                ...state,
                titleInput,
                isTitleChanged: isChanged,
            }

        case ACTIONS.SUMMARY:
            if (summaryInput === undefined || dbSummary === undefined) return state;
            isChanged = summaryInput !== dbSummary;
            return {
                ...state,
                summaryInput,
                isSummaryChanged: isChanged,
            }

        case ACTIONS.GENRE:
            if (genreInput === undefined || dbGenre === undefined) return state;
            isChanged = genreInput !== dbGenre;
            return {
                ...state,
                genreInput,
                isGenreChanged: isChanged,
            }

        case ACTIONS.KEYWORDS:
            if (keywordsInput === undefined || dbKeywords === undefined) return state;
            isChanged = keywordsInput !== dbKeywords;
            return {
                ...state,
                keywordsInput,
                isKeywordsChanged: isChanged,
            }

        case ACTIONS.UNDO:
            return {
                ...state,
                ...action.payload,
                isTitleChanged: false,
                isSummaryChanged: false,
                isGenreChanged: false,
                isKeywordsChanged: false,
            }

        case ACTIONS.UN_COLOR:
            return {
                ...state,
                isTitleChanged: false,
                isSummaryChanged: false,
                isGenreChanged: false,
                isKeywordsChanged: false,
            }

        default:
            throw new Error(`No such action:${action.type}`);
    }
}
