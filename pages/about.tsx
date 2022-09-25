import MyHead from "../component/MyHead";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import About from "../component/About";
import { MODE } from "../component/constants";


export default function AboutPage() {
  return (
    <>
      <MyHead title="全力君。"></MyHead>
      <Menu iniMode={MODE.ABOUT}></Menu>
      <About></About>
      <Footer></Footer>
    </>
  );
}