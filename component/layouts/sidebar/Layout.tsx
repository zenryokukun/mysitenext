/**
 * [概要]
 * サイドバー（右）のレイアウト。cssを工夫すれば（左）もできるかも？
 * メインコンテンツの枠はMainPartコンポーネント、サイドバーの枠はSidePartコンポーネントを使う必要がある。
 * 枠にはデフォルトのCSSを設定済。横幅950pxでレスポンシブ発動しサイドバーは下に表示されるようになる、
 * 枠のcssは、addStyleで追加、replaceStyleで交換可能。追加の場合、デフォルトで設定されているものを上書きたい場合は
 * !importantを付ける必要あるかも。
 * 
 * [使い方]
 * import Layout from "./Layout"
 * import Main from "./MainPart"
 * import Side from "./Side"
 * export function Page(){
 *   return(
 *     <Layout>
 *       <Main>your main content components...</Main>
 *       <Side>your sidebar content components...</Side>
 *     </Layout>
 *   );
 * }
 */

import { getStyle } from "../../common";
import styles from "./SLayout.module.css";

import type { ChildrenWithStyle } from "../../common";

export default function Layout({ children, addStyle, replaceStyle }: ChildrenWithStyle) {
  return (
    <div className={getStyle(styles.container, addStyle, replaceStyle)}>
      {children}
    </div>
  );
}