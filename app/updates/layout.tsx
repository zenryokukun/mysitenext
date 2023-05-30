import Menu from "../../component/Menu";
import { MODE } from "../../component/constants";

// import "prismjs/themes/prism-tomorrow.css"; // syntax hightlight用
// import "../../styles/prism-overrides.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Menu iniMode={MODE.UPDATES} />
      {children}
    </>
  );
}