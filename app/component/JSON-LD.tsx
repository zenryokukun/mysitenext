"use client";
/**
 * 各ページのパンくずリスト（JSON_LDを生成する）。
 * urlのディレクトリから動的生成するので、変則遷移は注意。
 * （ex: /blog -> /post/some-article）
 */

import { usePathname } from "next/navigation";
import { URL_DIR } from "../../component/constants";

type ItemListType = "ListItem";

interface ItemList {
  name: string, // 表示名
  item?: string, // url。最後の要素には付けないようなので`?`。
}

interface Crumb extends ItemList {
  "@type": ItemListType,
  position: number, // 位置
}

// metaデータ用パンくずリスト（json-ld）をItemListから生成
function breadCrumbsJSON(itemList: ItemList[]) {
  const crumbs: Crumb[] = itemList.map((elem, i) => {
    const crumb: Crumb = {
      "@type": "ListItem",
      position: i + 1,
      name: elem.name,
    }
    if (elem.item) {
      crumb["item"] = elem.item;
    }
    return crumb;
    // return { ...elem, "@type": "ListItem", position: i + 1 }
  });

  const breadCrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs,
  };

  return JSON.stringify(breadCrumb);
}

export default function JSON_LD() {

  // ルートのアドレス
  const root = "https://www.zenryoku-kun.com/";
  // 現在パスを取得
  const path = usePathname();

  // パスが取得できなければ空のフラグメントを返す
  if (path === null) {
    return null;
  }

  // パスをディレクトリごとに分割
  // "/".split("/") は["",""]、"/a/b".split("/")は["","a","b"]となる点に注意
  const dirList = path.split("/");

  // 想定はないけど、ルートすらなければリターン
  if (dirList.length === 0) {
    return null;
  }

  // 先頭（ルート）は""文字になるので、shiftしておく。
  dirList.shift();

  // ディレクトリの配列を操作し、パンくずリストを生成していく。
  // ルートは予め設定しておく。 
  const itemList: ItemList[] = [{ name: "home", item: root }];

  if (hasTutorial(dirList)) {
    // tutorialの場合、routeを問わず、/tutorialページからの遷移が中心となる。
    // そのため、間のrouteは区切らない。例えば、/tutorial/common/command-lineなら、
    // /tutorial,/tutorial/common,/tutorial/common/command-lineと区切るのではなく、
    // /tutorial,/tutorial/common/command-lineと区切る
    itemList.push({ name: "tutorial", item: root + "tutorial" })
    if (dirList.length > 1) {
      const name = dirList[dirList.length - 1]; // 最後の要素
      const item = root + dirList.join("/");
      itemList.push({ name, item })
    }

  } else {
    for (let i = 0; i < dirList.length; i++) {
      // ディレクトリ名取得
      let name = dirList[i];
      // 空文字（ルート）は["",""]になっているので、shift()した後も""が１つ残っている。
      // そのため、空文字ならcontinueする
      if (name === "") {
        continue;
      }
      /**
       * 変則ルートあれば記載
       */
      if (name === URL_DIR.MD || name === URL_DIR.MDX) {
        itemList.push({ name: "blog", item: root + "blog" })
        // 現状 /blog -> /post/article-folder-name　の遷移となる。
        // もしくは/blog -> /new-post/article-folder-nameの遷移。
        // そのため、/post 単体のリンクは存在せず、パンくずリスト不要となる。
        // だからpostの時は、/blogのリンク追加後、continueする
        continue;
      }

      const item = root + dirList.slice(0, i + 1).join("/");
      itemList.push({ name: name, item: item });
    }
  }

  // json-ldを生成
  const breadCrumbs = breadCrumbsJSON(itemList);

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadCrumbs }}
      />
    </section>
  );

}

function hasTutorial(dirs: string[]) {
  for (const dir of dirs) {
    if (dir === URL_DIR.TUTORIAL) {
      return true;
    }
  }
  return false;
}