interface IconLinkProp {
  a: string, //a-tag className
  href: string, //a-tag href attr
  fa: string, //font-awesome className
}

interface StockIconProp {
  fa: string,
}

export default function IconLink(
  { a, fa, href }: IconLinkProp
): JSX.Element {
  return (
    <a href={href} className={a}>
      <StockIcon fa={fa}></StockIcon>
    </a>
  );
}

// font-awesome class name
export function StockIcon({ fa }: StockIconProp): JSX.Element {
  return <i className={fa}></i>
}

