import { getStyle } from "../../common";
import styles from "./MainPart.module.css";

import type { ChildrenWithStyle } from "../../common";

export default function Main({ children, addStyle, replaceStyle }: ChildrenWithStyle) {
  return (
    <main
      className={getStyle(styles.container, addStyle, replaceStyle)}>
      {children}
    </main>
  );
}