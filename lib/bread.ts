
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