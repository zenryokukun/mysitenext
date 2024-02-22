import styles from "./Chips.module.css";

import type { Dispatch, SetStateAction } from "react";

interface ChipsP {
  keywords?: string[];
  selectedItems: string[];
  setSelectedItems: Dispatch<SetStateAction<string[]>>
}

export default function Chips({
  keywords, selectedItems, setSelectedItems
}: ChipsP) {

  const toggle = (item: string) => {
    const has = duplicate(selectedItems, item);
    if (has) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  }

  const filterOff = (e: React.MouseEvent<HTMLButtonElement>) => setSelectedItems([]);

  if (!keywords) return null;
  return (
    <div className={styles.container}>
      <div className={styles.label}>絞り込む</div>
      {keywords.map((kw, i) => {
        return (
          <Chip key={i} keyword={kw}
            selectedItems={selectedItems}
            toggle={toggle} />
        )
      })}
      <button className={styles.clear} onClick={filterOff}>すべてクリア</button>
    </div>
  )
}

interface ChipProp {
  keyword: string;
  selectedItems: string[];
  toggle: (item: string) => void;
}

function Chip({ keyword, selectedItems, toggle }: ChipProp) {
  const click = (e: React.MouseEvent<HTMLElement>) => toggle(keyword)
  const css = duplicate(selectedItems, keyword) ? `${styles.item} ${styles.highlight}` : styles.item;
  return (
    <div className={css} onClick={click}>{keyword}</div>
  );
}

/**
 * Helper functions
 */

function duplicate(items: string[], target: string) {
  for (const item of items) {
    if (target === item) return true;
  }
  return false;
}