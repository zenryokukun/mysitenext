import Head from "next/head";
import type { HeadProp } from "../types";
import { useRouter } from "next/router";
import { breadCrumbFromPath } from "../lib/bread";

function MyHead({
  title, metaDescription, useBreadCrumb,
  summary, site, cardTitle, description, imagePath,
}: HeadProp) {

  // bread-crumb用json-ldを生成
  const router = useRouter();
  const breadCrumb = breadCrumbFromPath(router);

  return (
    <Head>
      <title>{title || "全力君。"}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      {metaDescription && <meta name="description" content={metaDescription} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content="全力君。" />
      <meta property="og:url" content="https://www.zenryoku-kun.com/" />
      <meta property="og:image" content="https://www.zenryoku-kun.com/zen_logo.png" />

      <meta name="twitter:card" content={summary || "summary"} />
      <meta name="twitter:site" content={site || "@zenryoku_kun0"} />
      <meta name="twitter:title" content={cardTitle || "空と、海と、大地。そして絶望"} />
      <meta name="twitter:description" content={description || "極音超速で辿り着いた最果ては、あくまでも人の作った世界だった。"} />
      <meta name="twitter:image" content={imagePath || "https://www.zenryoku-kun.com/zen_logo.png"} />
      {/* useBreadCrumbがtrueかつbreadCrumbが正常に生成できた場合、パンくずリストをセット */}
      {(useBreadCrumb && breadCrumb) &&
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: breadCrumb }}
        />
      }

    </Head>
  );
}


export default MyHead