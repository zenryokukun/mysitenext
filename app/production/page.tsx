import Image from "next/image"
import productionList from "../../lib/prod-list"
import type { Production } from "../../types"
import type { Metadata } from "next"
import styles from "../../styles/Production.module.css"

export const metadata: Metadata = {
  title: "作品物",
  description: "私が作成したゲームやサービスのリンク集です。ローカルで動かしていたプログラムやゲームをWeb化して公開したり、あったら便利だと思うサービスを随時追加していきます。",
}

async function getProps() {
  const prods = await productionList();
  if (prods === undefined) {
    throw new Error("Failed to fetch data in /app/production");
  }
  return prods;
}

export default async function Page() {
  const prods = await getProps();
  return (
    <main className={styles.container}>
      {prods.map((prod, i) => <Product key={i} {...prod} />)}
    </main>
  )
}

function Product({ title, summary, href, imgPath, alt }: Production) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imgWrapper}>
        <Image src={imgPath} alt={alt} width={450} height={167}
          style={{ width: "100%", height: "100%" }} />
      </div>
      <div className={styles.info}>
        <h1 className={styles.title}>
          <a href={href}>{title}</a>
        </h1>
        <p className={styles.summary}>{summary}</p>
      </div>
    </div>
  );
}