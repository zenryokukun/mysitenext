/**
 * PathsDataをAccordionのpropsの型に変換する
 */
import { getTutorials } from "../../../lib/db/sqlite-query-tutorial";

interface AccordionProp {
  group: string;
  contents: { uri: string, name: string }[];
}

export default async function getAccordionProps() {
  const recs = await getTutorials();
  const props: AccordionProp[] = [];

  for (const rec of recs) {
    // ルートページ（/tutorial）はAccordionメニューから除外。
    if (rec.SLUGS === "") continue;

    if (props.length === 0) {
      // 最初のデータの場合
      props.push({
        group: rec.CATEGORY,
        contents: [{
          uri: `/tutorial/${rec.SLUGS.replaceAll(",", "/")}`,
          name: rec.TITLE,
        }],
      });

    } else {
      // 同じgroupが既にpropsに登録されているかチェック
      let sameProp: AccordionProp | undefined;
      for (const prop of props) {
        if (rec.CATEGORY === prop.group) {
          sameProp = prop;
          break;
        }
      }

      if (sameProp) {
        // 同じgroupが存在する場合
        sameProp.contents.push({
          uri: `/tutorial/${rec.SLUGS.replaceAll(",", "/")}`,
          name: rec.TITLE,
        })
      } else {
        // 存在しない場合
        props.push({
          group: rec.CATEGORY,
          contents: [{
            uri: `/tutorial/${rec.SLUGS.replaceAll(",", "/")}`,
            name: rec.TITLE,
          }],
        })
      }
    }
  }
  return props;
}

// export default async function getAccordionProps() {

//   const pathsFile = path.join(path.resolve(), "app/tutorial/[[...slug]]", "paths.json");
//   const raw = await readFile(pathsFile, { encoding: "utf-8" });
//   const data: PathsData[] = JSON.parse(raw);

//   const props: AccordionProp[] = []; // {group:string, contents:[{url:string,name:string}]}[]

//   // 最初のデータを追加
//   props.push({
//     group: data[0].group,
//     contents: [{
//       uri: `/tutorial/${data[0].slugs.join("/")}`,
//       name: data[0].name,
//     }],
//   })

//   for (const rec of data.slice(1)) {
//     let sameProp: AccordionProp | undefined = undefined;
//     // 同じgroupがpropに入っているか確認。入っていればそこにデータ追加。
//     // なければ新たに追加
//     for (const accProp of props) {
//       if (rec.group === accProp.group) {
//         sameProp = accProp;
//         break;
//       }
//     }

//     // 同じgroupのデータあり
//     if (sameProp !== undefined) {
//       sameProp.contents.push({
//         uri: `/tutorial/${rec.slugs.join("/")}`,
//         name: rec.name,
//       })
//     } else {
//       // 同じgroupのデータなし
//       props.push({
//         group: rec.group,
//         contents: [{
//           uri: `/tutorial/${rec.slugs.join("/")}`,
//           name: rec.name,
//         }],
//       })
//     }
//   }

//   // group 'root'は除外
//   let indexToRemove = -1
//   for (let i = 0; i < props.length; i++) {
//     if (props[i].group === "root") {
//       indexToRemove = i;
//       break;
//     }
//   }
//   if (indexToRemove >= 0 && indexToRemove < props.length) {
//     props.splice(indexToRemove, 1);
//   }

//   return props;
// }
