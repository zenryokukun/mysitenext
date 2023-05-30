/**
 * metadataはserverコンポでないと効かないため、
 * Cropperコンポーネントをuse clientにし独立させた。
 */
import Cropper from "./Cropper"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "スマホ画像切取君",
  description: "スマホで撮影した縦長の画像を、任意の縦横比に切り取るサービスです。アスペクト比は9:16、2:3、3:4、1:1から選べ、リサイズにも対応しています。",
}

export default function Page() {
  return (
    <Cropper />
  );

}