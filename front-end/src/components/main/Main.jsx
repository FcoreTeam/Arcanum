import intro from "../../videos/intro.mp4";
import styles from "./main.module.scss";

const Main = () => {
  return (
    <div className={styles.main}>
      <div className={styles.video__background}>
        <video autoPlay loop muted>
          <source src={intro} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
    </div>
  );
};

export default Main;