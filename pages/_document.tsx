import { Html, Main, Head, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ja">
      <Head>
        {/* 勝手に付けてくれるようなのでコメントアウト。 */}
        {/* <meta charSet="UTF-8" /> */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        {/* font-awesomeの全cssが全ページに挿入されてしまう。パッケージ版に移行したためコメントアウト */}
        {/* <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"></link> */}
      </Head>
      <body>
        <Main></Main>
        <NextScript></NextScript>
      </body>
    </Html>
  );
}