import type { ReactNode } from "react";
import styles from "../styles/Home.module.css";

export default function Home(): JSX.Element {
  return (
    <div className={styles.container}>
      {getImage("/home/ocean.jpg", "ocean")}
      {getImage("/home/dessert.jpg", "dessert")}
      {getImage("/home/river.jpg", "river")}
      {getImage("/home/pier.jpg", "pier")}
    </div>
  );
}

export function TopMessage(): JSX.Element {
  const title = <>空と、海と、大地<br />そして、絶望</>;
  const msg = <>極音超速で辿り着いた最果ては、あくまでも人によって作られた世界だった。<br />
    突如として虚空に開いた大穴は、人類がこれまで積み上げてきた知識全てを飲み込んでいった。
    新しい形で訪れた再生を前に、我々はただ俯くことしか出来なかった。
    がらんどうの価値を、海に沈んだ碇のように重くなった体とともに引きずりながら、今日もあてもなく人は大地を彷徨うのだった。</>

  return (
    <div className={styles.messageContainer}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.message}>{msg}</p>
    </div>
  );
}

function getImage(src: string, alt: string): ReactNode {
  return (
    <img src={src} alt={alt} className={styles.bgImage}></img>
  );
}

/*
import React from "react";
import Image from "./Image.tsx";

class Home extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="home">
        <Image src="ocean.jpg" alt="ocean" cname="home__wrapper__content" />
        <Image src="dessert.jpg" alt="dessert" cname="home__wrapper__content" />
        <Image src="river.jpg" alt="river" cname="home__wrapper__content" />
        <Image src="pier.jpg" alt="pier" cname="home__wrapper__content" />
      </div>
    );
  }
}

class TopMessage extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="message">
        <h1 className="message__home__title">{"空と、海と、大地"}<br />{"そして、絶望。"}</h1>

        <p className="message__home__text">

          // Finis qui ad summam soni super celeritatem pervenit, mundus ab hominibus creatus est.
          // Repente, foramen magnum, quod in vacuo apertum est, absorbuit omnem scientiam hominum, quae hucusque congesta erat.
          // In faciem regenerationis, quae nova via venit, despicere potuimus.
          // Dum traheret valorem praeteritorum cum corpore quasi plumbo graviore, terram usque hodie perrexit.
        
極音超速で辿り着いた最果ては、あくまでも人によって作られた世界だった。<br />
突如として虚空に開いた大穴は、人類がこれまで積み上げてきた知識全てを飲み込んでいった。
新しい形で訪れた再生を前に、我々はただ俯くことしか出来なかった。
過去の価値を、鉛のように重くなった体とともに引きずりながら、今日もあてもなく人は大地を彷徨うのだった。
        </p >
            // Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus
            

      </div >
    );
  }
}

export { Home, TopMessage };
*/