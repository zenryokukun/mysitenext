import Minesweeper from "./Minesweeper"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "マインスイーパー改",
  description: "React流にMinesweeperを作りました。レベルはEASY、MEDIUM、HARD、極の4種類から選べます。極みは48×68のマスに777の地雷が埋まっており、前代未聞の難易度です。全ての地雷マスに旗を立て、他のマスを全て開けば勝ちです。",
}

export default function Page() {
  return (
    <Minesweeper />
  )
}