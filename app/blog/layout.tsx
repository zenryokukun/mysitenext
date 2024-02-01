import Navigation from "../../component/Navigation"
import Footer from "../../component/Footer"
import { MODE } from "../../component/constants"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "記事一覧",
  description: "ブログ記事の一覧です。主に、プログラム関係の記事や、一人旅に関する記事を公開しています。",
}


export default function Layout(
  { children }: { children: React.ReactNode }
) {
  return (
    <>
      <Navigation iniMode={MODE.BLOG} />
      {children}
      <Footer />
    </>
  )
}