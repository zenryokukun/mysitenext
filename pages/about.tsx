import MyHead from "../component/MyHead";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import About from "../component/About";
import { MODE } from "../component/constants";

/**Description About Page */

export default function AboutPage() {
  return (
    <>
      <MyHead title="ćšććă"></MyHead>
      <Menu iniMode={MODE.ABOUT}></Menu>
      <About></About>
      <Footer></Footer>
    </>
  );
}