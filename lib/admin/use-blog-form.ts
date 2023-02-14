
/**
 * InsertMode Componenで使うロジックのreducer。
 */
import { useReducer } from "react";

export type Target = "genre" | "dir"
    | "thumb" | "summary" | "title"
    | "isForce" | "keywordsInput";

interface FormState {
    genre: string,
    // genres: string[],
    dir: string,
    thumb: string,
    summary: string,
    title: string,
    isForce: boolean,
    // mode: Mode,
    keywordsInput: string,
}

export interface FormAction {
    type: number,
    payload?: {
        genres?: string[],
        change?: { target: Target, value: string | boolean, },
        thumbs?: React.MouseEvent<HTMLButtonElement>,
    }
}

export const ACTIONS = {
    INIT: 0,
    CHANGE: 1,
    FILES: 2,
};

function formReducer(state: FormState, action: FormAction) {

    const { payload } = action;
    if (!payload) return state;
    const { change } = payload;
    switch (action.type) {

        case ACTIONS.INIT:

            const { genres } = payload;
            if (!genres || genres.length === 0) return state;
            return {
                ...state,
                genres,
                genre: genres[0],
            }

        case ACTIONS.CHANGE:
            if (!change) return state;
            return {
                ...state,
                [change.target]: change.value,
            };

        default:
            throw new Error(`No such action type:${action.type}`)
    }
}


export function useBlogForm(iniGenre: string) {

    const ini: FormState = {
        genre: iniGenre,
        // genres: [],
        dir: "",
        thumb: "",
        summary: "",
        title: "",
        isForce: false,
        // mode: "insert",
        keywordsInput: "",
    };

    const [state, dispatch] = useReducer<(s: FormState, a: FormAction) => FormState>(formReducer, ini);
    return { state, dispatch };
}