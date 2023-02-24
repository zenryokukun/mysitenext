import MyHead from "../component/MyHead";
import Menu from "../component/Menu";
import Footer from "../component/Footer";
import Home, { TopMessage } from "../component/Home";
import { MODE } from "../component/constants";

/**Description Home Page
 * エントリポイント。ドメインのルートで表示するページ。
 */

function Main() {
  return (
    <>
      <MyHead title="全力君。" ></MyHead >
      <Menu iniMode={MODE.HOME} ></Menu>
      <Home ></Home>
      <TopMessage ></TopMessage>
      <Footer></Footer>
    </>

  );
}

export default Main;