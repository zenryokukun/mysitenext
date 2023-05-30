import Converter from "./Converter"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "MD-CONVERTER",
    description: "MDを見やく、簡易なCSS込みでHTMLに変換するサービスです。GitHub-Flavored-MarkDownに対応しています。",
}

export default function Page() {
    return (
        <Converter />
    )
}