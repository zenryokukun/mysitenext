"use client";

import { useState } from "react";
import Chips from "./Chips";
import BlogCard from "./BlogCard";
import { CaretRight } from "../../component/Icons";
import styles from "./Content.module.css"
import type { BlogProp } from "./page";

interface P {
  keywords: string[];
  blogDocs: BlogProp[];
}

export default function Content({ keywords, blogDocs }: P) {

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [isClicked, setIsClicked] = useState(false);

  const gridStyle = isClicked ? `${styles.grid} ${styles.gridOpen}` : styles.grid;

  const caretStyle = isClicked ? `${styles.caret} ${styles.rotate}` : styles.caret;

  return (
    <>
      <div className={styles.mobileLabel} onClick={() => setIsClicked(!isClicked)}>
        <div className={styles.mobileText}>絞り込み</div>
        <CaretRight className={caretStyle} />
      </div>
      <div className={gridStyle}>
        <Chips
          keywords={keywords}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      </div>
      <div className={styles.content}>
        {selectedItems.length === 0
          ? blogDocs.map((blog, i) => <BlogCard key={i} blog={blog} i={i} />)
          : <FilteredBlogCard filter={selectedItems} blogDocs={blogDocs} />
        }
      </div>
    </>
  );
}

interface FilteredP {
  filter: string[];
  blogDocs: BlogProp[];
}

/**
 * selectedItemsの選択内容に応じてfilterされたblogDocsを返すヘルパー的なComponent。
 */
function FilteredBlogCard({ filter, blogDocs }: FilteredP) {
  return (
    <>
      {blogDocs.map((blog, i) => {
        const { keywords } = blog;
        // keywordが設定されていないブログはfilter対象にならないためnull。
        if (keywords === undefined) return null;
        let match = false;
        for (const kw of keywords) {
          for (const targ of filter) {
            if (kw === targ) {
              return <BlogCard key={i} blog={blog} i={i} />
            }
          }
        }

      })}
    </>
  );
}