
import { getStyle } from "../../common";
import styles from "./SidePart.module.css";

import type { ChildrenWithStyle } from "../../common";

export default function Side({ children, addStyle, replaceStyle }: ChildrenWithStyle) {
  return (
    <aside className={getStyle(styles.container, addStyle, replaceStyle)}>
      {children}
    </aside>
  );
}