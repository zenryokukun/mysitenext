import MyHead from "./MyHead";
import type { ReactElement } from "react";
export default function Layout({ children }: { children: ReactElement }, { title }: { title: string }) {
  return (
    <>
      <MyHead title={title}></MyHead>
      <main>
        {children}
      </main>
    </>
  );
}