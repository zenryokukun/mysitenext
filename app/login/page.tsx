import type { Metadata } from "next";
import Login from "./Login";


export const metadata: Metadata = {
  title: "login page",
  description: "管理ページ向けログインページ",
}

export default function Page() {
  return <Login />;
}