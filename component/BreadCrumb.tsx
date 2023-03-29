/**
 * 現在のルートのディレクトリから生成したパンくずリスト（UI用）
 * /blog -> /post/202201_1、/production -> /html/marimo/index.html のような遷移があるので、あまり使えない。
 * そのため未使用。。
*/

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./BreadCrumb.module.css";

interface CrumbType {
  crumb: string, href: string, char?: string
}

export default function BreadCrumb() {
  const router = useRouter();
  const pathStr = router.asPath.split("/")
  const dirList = pathStr.slice(1,); // 先頭の""を削除

  if (!dirList || dirList.length === 0) {
    return null;
  }

  const pathList = dirList.map((dir, i) => {
    return { crumb: dir, href: "/" + dirList.slice(0, i + 1).join("/") };
  });

  return (
    <nav>
      <ol className={styles.container}>
        <Crumb crumb="home" href="/" char="" />
        {pathList.map((bread, i) => {
          if (i < pathList.length - 1)
            return <Crumb key={bread.href} {...bread} char="&gt;" />;
          else
            return <LastCrumb key={bread.href} {...bread} char="&gt;" />
        }
        )}
      </ol>
    </nav>
  );
}

function Crumb({ crumb, href, char }: CrumbType,) {
  return (
    <li className={styles.item}>{char || ""}
      <Link href={href} legacyBehavior>{crumb}</Link>
    </li>
  );
}

function LastCrumb({ crumb, char }: CrumbType) {
  return (
    <li className={styles.item}>{(char || "") + crumb}</li>
  );
}