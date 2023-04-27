interface IconLinkProp {
  a: string, // a-tag className
  href: string, // a-tag href attr
  fa: string, // font-awesome className
  label?: string // aria-label for underlying a tag. For screen-reader.
}

interface StockIconProp {
  fa: string,
}

export default function IconLink(
  { a, fa, href, label }: IconLinkProp
): JSX.Element {
  label = label || "";
  return (
    <a href={href} className={a} aria-label={label}>
      <StockIcon fa={fa}></StockIcon>
    </a>
  );
}

// font-awesome class name
export function StockIcon({ fa }: StockIconProp): JSX.Element {
  return <i className={fa}></i>
}

