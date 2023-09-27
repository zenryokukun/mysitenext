/**
 * "next/image"のラッパー。
 * .mdx内でImageコンポーネントを使うと、<img>タグがそのまま展開されるため、
 * CSSで .article >* {width:100%}のように設定しているので、幅が伸びてしまう。
 * 
 * .mdの時と同じように、<div></div>で括ってあげるためのコンポーネント
 */

import Image from "next/image";
import type { StaticImageData } from "next/image";

// 適宜つぎ足す。ドキュメントは下のリンク。
// https://nextjs.org/docs/pages/api-reference/components/image#style
interface P {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  style?: { [key: string]: string };
}

export default function ImageWrapper(props: P) {
  return (
    <div >
      <Image {...props} style={{
        "padding": "0.5rem",
        "boxShadow": "0 2px 5px 0 rgba(0, 0, 0, .16), 0 2px 10px 0 rgba(0, 0, 0, .12)",
      }} />
    </div>
  );
}