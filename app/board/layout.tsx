import Navigation from "../../component/Navigation";
import Footer from "../../component/Footer";
import { MODE } from "../../component/constants";

export default function Layout(
  { children }: { children: React.ReactNode }
) {
  return (
    <>
      <Navigation iniMode={MODE.BOARD} />
      {children}
      <Footer />
    </>
  )
}