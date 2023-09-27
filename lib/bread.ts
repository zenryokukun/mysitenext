
/**
 * 
 * パンくずリストの構造化データを返すモジュール。
 * JSON-ld形式
 * Google検索画面で表示されるパンくずリスト
 * 
 */

/**scriptタグに以下のように入れる:
   <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
          "@type": "ListItem",
          "position": 1,
          "name": "Books",
          "item": "https://example.com/books"
        },
        {...}
      ]}
  </script>

[Reactの場合]：
  <script 
    type="application/ld+json" 
    dangerouslySetInnerHTML={{ __html: some_JSON_string }}
  />
*/
import { URL_DIR } from "../component/constants";
import type { NextRouter } from "next/router";

type ItemListType = "ListItem";

interface ItemList {
  name: string, // 表示名
  item?: string, // url。最後の要素には付けないようなので`?`。
}

interface Crumb extends ItemList {
  "@type": ItemListType,
  position: number, // 位置
}

// metaデータ用パンくずリストをjson-ldで生成
export default function breadCrumbsJSON(itemList: ItemList[]) {
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

/**
 * 
 * Pageに応じたbread crumbsを返すためのhelper関数たち。
 * ページ単位での修正が減るように、、、
 *  
 */

/**
 * 現在ページからパンくずjson+ldをを生成する関数。
 * ページ単位で設定すると、ディレクトリを変えたときに全ページ修正となってしまうため、
 * なるべくこの関数を共通処理にして、ここだけなおせばOKにする。
 * 
 * NextRouterのパスから動的生成するため、/blog -> /postといった変則ナビゲーションは
 * /（ルート） -> /post とパンくずリストが生成される。（本来は/blog -> /post とリストを生成したい）
 * 変則ナビも、この関数で吸収する必要がある点に留意。
 * 
 * 外部のHTMLを呼び出している場合等、変則的すぎる場合はこの関数を使わず、ページ内で完結させとく。
 * 
 * @param router NextRouter
 * @returns breadcrumb用json+ld
 */
export function breadCrumbFromPath(router: NextRouter) {

  const root = "https://www.zenryoku-kun.com/";

  // パスを/で分割し、ディレクトリ単位の配列にする。
  const dirList = router.asPath.split("/");

  // 想定はないけど、ルートすらなければリターン
  if (dirList.length === 0) return;

  // 先頭（ルート）は""文字になるので、shiftしておく。
  dirList.shift();

  // ディレクトリの配列を操作し、パンくずリストを生成していく。
  // ルートはshiftで消しているので、予め設定しておく
  const itemList: ItemList[] = [{ name: "home", item: root }];
  for (let i = 0; i < dirList.length; i++) {
    // ディレクトリ名取得
    let name = dirList[i];
    // 空文字（ルート）ならhomeを設定。
    if (name === "") {
      name = "home";
    }

    // 変則ナビ対応　/blog -> /post/*。"post"が出現した時、"/blog"のリストを差し込む
    if (name === URL_DIR.MD || name === URL_DIR.MDX) {
      itemList.push({ name: "blog", item: root + "blog" })
      // 現状 /blog -> /post/article-folder-name　の遷移となる。
      // そのため、/post 単体のリンクは存在せず、パンくずリスト不要となる。
      // だからpostの時は、/blogのリンク追加後、continueする
      continue;
    }

    // これまでディレクトリからパンくずを生成して追加
    const item = root + dirList.slice(0, i + 1).join("/")
    itemList.push({ name: name, item: item })
  }
  return breadCrumbsJSON(itemList)
}
