import MyHead from "../component/MyHead";
import { useRouter } from "next/router";
/**Description　Testページ。後で削除　*/

export default function Test() {
  const router = useRouter();
  const click = () => router.push("/updates") // updateのページにリダイレクトしてくれる！
  return (
    <>
      <MyHead title="linked page"></MyHead>
      <div>Linked Page!</div>
      <div><button onClick={click}>Push me!</button></div>
    </>
  );
}