import Head from "next/head";

function MyHead({ title }: { title: string }) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
    </Head>
  );
}
export default MyHead