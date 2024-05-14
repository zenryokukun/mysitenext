"use client";
/**
 * @TODO 将来的にAccordionが入れ子になる可能性も考慮。
 */
import { useState } from "react";
import Accordion from "./Accordion";
import { CaretRight } from "../../../component/Icons";
import styles from "./Menu.module.css";

interface Prop {
  data: {
    group: string;
    contents: {
      uri: string;
      name: string;
    }[]
  }[]
}

export default function Menu({ data }: Prop) {
  const [menuOn, setMenuOn] = useState(false);

  const click = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMenuOn(!menuOn);
  }

  const caretStyle = menuOn ? `${styles.caretIcon} ${styles.rotate}` : styles.caretIcon;

  const gridStyle = menuOn ? `${styles.gridDepth1} ${styles.gridOpen}` : styles.gridDepth1;

  return (
    <section className={styles.container}>
      <button className={styles.mobileMenu} onClick={click}>
        <CaretRight className={caretStyle} />
        <div>Menu</div>
      </button>
      <nav className={gridStyle}>
        <div>
          {data.map((acc, i) => {
            return <Accordion key={i} title={acc.group} contents={acc.contents} />
          })}
        </div>
      </nav>
    </section>
  );
}