import Image from "next/image";
import MyHead from "../../component/MyHead";
import Menu from "../../component/Menu";
import Footer from "../../component/Footer";
import { MODE } from "../../component/constants";
import productionList from "../../lib/prod-list";

import type { Production } from "../../types";
import styles from "../../styles/Production.module.css";

/**
 * Description 成果物Page 
 * TODO
 *  - 成果物が増えたらデータをベタ打ちでなくDBに登録することを検討。
 *  - DBは都度登録が面倒なので当面/data/production.jsonで対応
 */

interface Prop {
  prods: Production[];
}

export default function Production({ prods }: Prop) {

  return (
    <>
      <MyHead
        metaDescription="私が作成したゲームやサービスのリンク集です。ローカルで動かしていたプログラムやゲームをWeb化して公開したり、あったら便利だと思うサービスを随時追加していきます。"
        useBreadCrumb={true}
        title="作品物"
      />
      <Menu iniMode={MODE.PRODUCTION}></Menu>
      <main className={styles.container}>
        {prods.map((prod, i) => <Product key={i} {...prod} />)}
      </main>
      <Footer></Footer>
    </>
  );
}

function Product({ title, summary, href, imgPath, alt }: Production) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.imgWrapper}>
        {/* <Image src={imgPath} alt={alt} fill sizes="50vw" /> */}
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

export async function getStaticProps() {

  const prods = await productionList();

  if (!prods) {
    return {
      notFound: true,
    }
  }

  return {
    props: { prods }
  }


}