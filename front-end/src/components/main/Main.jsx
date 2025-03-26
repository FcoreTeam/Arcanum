import intro from "../../videos/intro.mp4";
import { useState } from "react";
import Games from "./games/Games";
import clsx from "clsx";
import styles from "./main.module.scss";

const Main = () => {
  const [currentController, setController] = useState("prev"); 
  
  return (
    <div className={styles.main}>
      <div className={styles.video__background}>
        <video autoPlay loop muted>
          <source src={intro} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
      <section className={styles.main__page}>
        <div>
          <p className={styles.main__title}>Arcanum</p>
          <p className={styles.main__description}>
            Иммерсивный цифровой детектив
          </p>
        </div>

        <div className={styles.main__games}>
          <div className={styles.games__controller}>
            <div
              className={clsx(
                styles.controller,
                currentController === "prev" ? styles.active : ""
              )}
              onClick={() => setController("prev")}
            >
              Прошедшие игры
            </div>
            <div
              className={clsx(
                styles.controller,
                currentController === "upcome" ? styles.active : ""
              )}
              onClick={() => setController("upcome")}
            >
              Предстоящие игры
            </div>
          </div>
          <div className={styles.games}>
            <Games category={currentController} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
