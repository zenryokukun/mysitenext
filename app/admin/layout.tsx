import type { Metadata } from "next"

/**
 * /admin直下のページは全てindex登録したくないので追加
 */
export const metadata: Metadata = {
  robots: {
    index: false,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  )
}