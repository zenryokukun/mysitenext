/**
 * tutorial
 * @TODO 
 *  - DONE:import Navigion
 *  - DONE:constants.MODEに'tutorial'追加
 *  - DONE:import Footer
 *  - DONE: robots.indexを外す
 *  - JSON+LD対応
 */
import Navigation from "../../../component/Navigation";
import { MODE } from "../../../component/constants";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation iniMode={MODE.PRODUCTION} />
      {children}
    </>
  )
}