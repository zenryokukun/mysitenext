import Minesweeper from "./Minesweeper"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Minesweeper",
    description: "懐かしのマインスイーパーです。地雷が埋まっているマスに旗を立て、それ以外のマスを全て開けば勝ちです。EASY,MEDIUM,HARDから難易度を選べます。楽しんで下さい。",
}

export default function Page() {
    return (
        <Minesweeper />
    )
}