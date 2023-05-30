import Menu from "../../component/Menu";
import { MODE } from "../../component/constants";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Menu iniMode={MODE.ABOUT} />
      {children}
    </>
  );
}