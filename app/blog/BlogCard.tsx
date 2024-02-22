
import Image from "next/image";
import Link from "next/link";
import blogRoute from "../../lib/blog-route";
import styles from "./BlogCard.module.css"
import { BlogInfoOverrides } from "./page";

interface BlogLinkProp {
  blog: BlogInfoOverrides;
  i: number;
}

export default function BlogCard({ blog, i }: BlogLinkProp) {
  const { assetsDir, thumb, posted, title, summary, md } = blog;
  const thumbClass = thumb.length > 0 ? styles.thumb : styles.logo

  // EX:/public/posts/201102_1 
  // サムネのパス。mdでもmdxでも、/public/postsにある。
  const thumbPath = thumb.length > 0
    ? "/posts/" + assetsDir + "/" + thumb
    : "/zen_logo.png";
  // ページのパス。md:/post/記事名、mdx:/new-post/記事名
  const route = blogRoute({ assetsDir, md });

  return (
    <div className={styles.wrapper}>
      <div className={styles.imgWrapper}>
        <Image
          src={thumbPath}
          alt="thumbnail"
          fill
          sizes="(max-width:900px):95vw,(max-width:1100px) 25vw,16vw"
          className={thumbClass}
          priority={i < 10 ? true : false} />
      </div>
      <h3 className={styles.when}>{posted}</h3>
      <div className={styles.description}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.summary}>{summary}</p>
      </div>
      <Link href={route} className={styles.noDecoration}>
        <button className={styles.read}>
          Read
        </button>
      </Link>
    </div>
  )
}