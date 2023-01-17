/**
 * 
 * Component内で共通して使う関数とか。
 * /component/layoutsで使っているのが多くなると思う
 * 
 */

import type { PropsWithChildren } from "react";

/**
 * {children}につける型。レイアウトやコンポーネントでデフォルトのCSSを追加、入れ替えするために
 * PropsWithChildrenを拡張。
 */
export interface ChildrenWithStyle extends PropsWithChildren {
    addStyle?: string, // styleを追加する場合
    replaceStyle?: string, // styleを上書きする場合
}

/**
 * defaultのcss、拡張、入れ替えに応じたcssを返す関数。ChildrenWithStyle型を受けるコンポーネントで使う。
 * @param defaultStyle デフォルトのスタイル
 * @param addStyle 追加するスタイル
 * @param replaceStyle 入れ替えるスタイル
 * @returns 追加があればaddStyle、入れ替えがあればreplaceStyle、どちらもがなければdefaultStyle、
 */
export function getStyle(defaultStyle: string, addStyle?: string, replaceStyle?: string) {
    if (addStyle) {
        return defaultStyle + " " + addStyle;
    }
    if (replaceStyle) {
        return replaceStyle;
    }
    return defaultStyle;
}