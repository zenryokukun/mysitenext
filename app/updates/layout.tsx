import Navigation from "../../component/Navigation";
import { MODE } from "../../component/constants";

// import "prismjs/themes/prism-tomorrow.css"; // syntax hightlight用
// import "../../styles/prism-overrides.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation iniMode={MODE.UPDATES} />
      {children}
    </>
  );
}