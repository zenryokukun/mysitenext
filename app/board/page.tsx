import Board from "./Board";
import { getNewComments } from "../../lib/db/sqlite-query-comments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "掲示板",
  description: "みんなの掲示板です。サイトに対する要望やご意見を投稿していただけると幸いです。",
}

// getServerSidePropsと同じ動作にするために必要。
export const revalidate = 0;
async function getProps() {
  const comments = await getNewComments(200);
  return JSON.parse(JSON.stringify(comments));
}

export default async function Page() {
  const comments = await getProps();
  return (
    <Board comments={comments} />
  )
}