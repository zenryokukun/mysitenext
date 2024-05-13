/**
 * mdxファイル内の注意書きに使うコンポーネント
 */

import styles from "./Caution.module.css"

interface Prop {
  children: React.ReactNode,
  icon?: boolean,
}

/**
 * iconを表示したい場合、iconにtrueを設定すること
 */
export default function Caution({ children, icon }: Prop) {
  let style = styles.wrapper;
  if (icon) {
    style += " " + styles.withIcon;
  }
  return (
    <aside className={style} >{children}</aside>
  )
}