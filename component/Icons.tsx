/**
 * font-awsesomeアイコンのSVGを返すComponent群。
 * .svgファイルをimgタグのsrcに設定するのではなく、svgタグとして使う。
 * fortawesomeのパッケージを使うと@fortawesome/fontawesome-svg-core/styles.cssが重いので、こちらのComponentに移行させる。
 * そうしないとCSSでcolorを設定した時に背景も塗りつぶされてしまうので。
 * font-awesomeからSVGをダウンロードして使う: https://fontawesome.com/
 * DLした.svgファイルは/iconsに保存
 * 
 * [naming rules]
 * font-awesomeにはsolid（塗りつぶし）とregular（塗りつぶしでない）がある。brandsのように例外もあるかも。
 * regular -> Icon名Regular
 * regular以外 -> Icon名のみ
 */

interface BaseProp {

  // inlineのstyleオブジェクトに追加するwidthとheight。
  // svgの大きさはここで設定。
  // widthを指定すれば、heightは勝手に計算してくれる模様（仕様未確認）。
  // heightだけ指定すると、widthは計算してくれないので注意。
  width?: string;
  height?: string;

  // cssのclass名。css moduleのclassNameを想定
  // 色（colorプロパティ）等を設定。
  // cssでwidthとheightの指定も出来る。
  // inlineのwidthとheightだとCSSより優先度も高くなるし、media-queryも使えないので、こちらでの指定でも可。
  // 指定する場合、inlineのwidthとheightは指定しないこと。
  className?: string;

  // in-lineのスタイルを個別適用する場合に指定。
  // widthとheightは個別に設定するので渡す必要はないga
  style?: React.CSSProperties;

  // svgタグのviewboxに設定するwidthとheight
  viewBoxWidth?: number;
  viewBoxHeight?: number;

  // svgタグ内のpathタグを想定
  children?: React.ReactNode;
}

type SVGProp = Omit<BaseProp, "viewBoxWidth" | "viewBoxHeight" | "svgWidth" | "svgHeight">

/**
 * svgアイコンのラッパー。内部利用のみのためExportしない。
 * svgタグのwidth,height属性が設定されているとCSSがうまく効かないので設定しない。
 * viewboxのwidthとheightはアスペクト比を維持するために必要（仕様未確認）
 * childrenはsvgタグ内のpathタグを想定。
 * iconはiタグでラップするのが良いとのこと。最終的に返すjsxは
 * <i><svg><path></path></svg></i>となる。
 * @param SVGProp
 * @returns 
 */
function Base({
  width, height,
  className, style,
  viewBoxWidth, viewBoxHeight,
  children
}: BaseProp) {
  return (
    <i className={className} style={{ ...style, width, height, display: "inline-block" }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        style={{ fill: "currentcolor", verticalAlign: "-0.125em" }}>
        {children}
      </svg>
    </i>
  )
}

export function Twitter(props: SVGProp) {
  return (
    <Base　{...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
    </Base >
  )
}

export function GitHub(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={496} viewBoxHeight={512}>
      <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
    </Base>
  )
}

export function Instagram(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={448} viewBoxHeight={512}>
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </Base>
  )
}

export function Bar(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={448} viewBoxHeight={512}>
      <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
    </Base>
  )
}

export function BuildingShield(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={576} viewBoxHeight={512}>
      <path d="M0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V207l-42.4 17H304 272c-8.8 0-16 7.2-16 16v32 24.2V304c0 .9 .1 1.7 .2 2.6c2.3 58.1 24.1 144.8 98.7 201.5c-5.8 2.5-12.2 3.9-18.9 3.9H240V432c0-26.5-21.5-48-48-48s-48 21.5-48 48v80H48c-26.5 0-48-21.5-48-48V48zM80 224c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H80zm80 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zM64 112v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zM176 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H176zm80 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H272c-8.8 0-16 7.2-16 16zM423.1 225.7c5.7-2.3 12.1-2.3 17.8 0l120 48C570 277.4 576 286.2 576 296c0 63.3-25.9 168.8-134.8 214.2c-5.9 2.5-12.6 2.5-18.5 0C313.9 464.8 288 359.3 288 296c0-9.8 6-18.6 15.1-22.3l120-48zM527.4 312L432 273.8V461.7c68.2-33 91.5-99 95.4-149.7z" />
    </Base>
  )
}

export function Clock(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
    </Base>
  )
}

export function CopyRightRegular(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM199.4 312.6c-31.2-31.2-31.2-81.9 0-113.1s81.9-31.2 113.1 0c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9c-50-50-131-50-181 0s-50 131 0 181s131 50 181 0c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0c-31.2 31.2-81.9 31.2-113.1 0z" />
    </Base>
  )
}

export function CopyRight(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM199.4 312.6c31.2 31.2 81.9 31.2 113.1 0c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9c-50 50-131 50-181 0s-50-131 0-181s131-50 181 0c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0c-31.2-31.2-81.9-31.2-113.1 0s-31.2 81.9 0 113.1z" />
    </Base>
  )
}

export function Envelope(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
    </Base>
  )
}

export function Heart(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
    </Base>
  )
}

export function InternetExplorer(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M483 159.7c10.9-24.6 21.4-60.4 21.4-87.9 0-72.7-79.6-98.4-209.7-38.6-107.6-7.2-211.2 73.7-237.1 186.5 30.9-34.9 78.3-82.3 122-101.2C125.4 166.9 79.1 228 44 291.7 23.2 329.7 0 390.9 0 436.7c0 98.6 92.9 86.5 180.3 42 31.4 15.4 66.6 15.6 101.7 15.6 97.1 0 184.2-54.3 216.8-146H377.9c-52.5 88.6-196.8 53-196.8-47.4H509.9c6.4-43.6-1.7-95.7-26.9-141.2zM64.6 346.9c17.7 51.2 53.7 95.9 100.3 123.3-88.7 48.9-173.3 29.1-100.3-123.3zm116-108.9c2-55.2 50.3-94.9 104-94.9 53.4 0 102 39.7 104 94.9H180.5zm184.5-187.6c21.4-10.3 48.6-22 72.6-22 31.4 0 54.3 21.7 54.3 53.7 0 20-7.4 49-14.6 67.9-26.3-42.3-66-81.6-112.3-99.6z" />
    </Base>
  )
}

export function Key(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
    </Base>
  )
}

export function Person(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={320} viewBoxHeight={512}>
      <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z" />
    </Base>
  )
}

export function Poo(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M268.9 .9c-5.5-.7-11 1.4-14.5 5.7s-4.6 10.1-2.8 15.4c2.8 8.2 4.3 16.9 4.3 26.1c0 44.1-35.7 79.9-79.8 80H160c-35.3 0-64 28.7-64 64c0 19.1 8.4 36.3 21.7 48H104c-39.8 0-72 32.2-72 72c0 23.2 11 43.8 28 57c-34.1 5.7-60 35.3-60 71c0 39.8 32.2 72 72 72H440c39.8 0 72-32.2 72-72c0-35.7-25.9-65.3-60-71c17-13.2 28-33.8 28-57c0-39.8-32.2-72-72-72H394.3c13.3-11.7 21.7-28.9 21.7-48c0-35.3-28.7-64-64-64h-5.5c3.5-10 5.5-20.8 5.5-32c0-48.6-36.2-88.8-83.1-95.1zM192 256a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm64 108.3c0 2.4-.7 4.8-2.2 6.7c-8.2 10.5-39.5 45-93.8 45s-85.6-34.6-93.8-45c-1.5-1.9-2.2-4.3-2.2-6.7c0-6.8 5.5-12.3 12.3-12.3H339.7c6.8 0 12.3 5.5 12.3 12.3z" />
    </Base>
  )
}

export function RectangleAd(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={576} viewBoxHeight={512}>
      <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM229.5 173.3l72 144c5.9 11.9 1.1 26.3-10.7 32.2s-26.3 1.1-32.2-10.7L253.2 328H162.8l-5.4 10.7c-5.9 11.9-20.3 16.7-32.2 10.7s-16.7-20.3-10.7-32.2l72-144c4.1-8.1 12.4-13.3 21.5-13.3s17.4 5.1 21.5 13.3zM208 237.7L186.8 280h42.3L208 237.7zM392 256a24 24 0 1 0 0 48 24 24 0 1 0 0-48zm24-43.9V184c0-13.3 10.7-24 24-24s24 10.7 24 24v96 48c0 13.3-10.7 24-24 24c-6.6 0-12.6-2.7-17-7c-9.4 4.5-19.9 7-31 7c-39.8 0-72-32.2-72-72s32.2-72 72-72c8.4 0 16.5 1.4 24 4.1z" />
    </Base>
  )
}

export function ToriiGate(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M0 80c0 26.5 21.5 48 48 48H64v64h64V128h96v64h64V128h96v64h64V128h16c26.5 0 48-21.5 48-48V13.4C512 6 506 0 498.6 0c-1.7 0-3.4 .3-5 1l-49 19.6C425.7 28.1 405.5 32 385.2 32H126.8c-20.4 0-40.5-3.9-59.4-11.4L18.4 1c-1.6-.6-3.3-1-5-1C6 0 0 6 0 13.4V80zM64 288V480c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384V480c0 17.7 14.3 32 32 32s32-14.3 32-32V288h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H64z" />
    </Base>
  )
}

export function TriangleExclamation(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
    </Base>
  )
}

export function AddressCard(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={576} viewBoxHeight={512}>
      <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 256h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H496c8.8 0 16 7.2 16 16s-7.2 16-16 16H368c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
    </Base>
  )
}

export function Message(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={512} viewBoxHeight={512}>
      <path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64h96v80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64z" />
    </Base >
  )
}

export function CaretRight(props: SVGProp) {
  return (
    <Base {...props} viewBoxWidth={256} viewBoxHeight={512} >
      <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" />
    </Base>
  );
}