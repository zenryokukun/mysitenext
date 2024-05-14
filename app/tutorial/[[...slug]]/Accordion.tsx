import { useState } from "react";
import { CaretRight } from "../../../component/Icons";
import styles from "./Accordion.module.css";

interface AccordionItem {
  uri: string;
  name: string;
}

interface AccordionProp {
  title: string;
  contents: AccordionItem[];
}

export default function Accordion({ title, contents }: AccordionProp) {

  const [isClicked, setIsClicked] = useState(false);

  const [gridStyle, iconStyle] = getStyles(isClicked);

  return (
    <div
      className={styles.container}
      onClick={() => setIsClicked(!isClicked)}
    >
      <div className={styles.title}>
        <div>{title}</div>
        <div className={iconStyle}>
          <CaretRight className={styles.caret} />
        </div>
      </div>
      <div className={gridStyle}>
        <ul className={styles.gridItems}>
          {contents.map((content, i) => {
            const { uri, name } = content;
            return (
              <li key={i}>
                <a href={uri}>{name}</a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}


function getStyles(isClicked: boolean) {
  let gridStyle = styles.grid;
  let iconStyle = styles.icon;
  if (isClicked) {
    gridStyle += " " + styles.gridOpen;
    iconStyle += " " + styles.iconRotate;
  }
  // [gridStyle,iconStyle]
  return [gridStyle, iconStyle];
};