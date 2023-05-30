import Board from "./Board";
import { getComments } from "../../lib/db/func";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "掲示板",
  description: "みんなの掲示板です。サイトに対する要望やご意見を投稿していただけると幸いです。",
}

// getServerSidePropsと同じ動作にするために必要。
export const revalidate = 0;
async function getProps() {
  const comments = await getComments(20);
  return JSON.parse(JSON.stringify(comments));
}

export default async function Page() {
  const comments = await getProps();
  return (
    <Board comments={comments} />
  )
}