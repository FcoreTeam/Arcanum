import intro from "../../videos/intro.mp4";
import Button from "../@ui/Button/Button";
import fcore from "../../img/fcore.png";

import styles from "./intro.module.scss";

const Intro = () => {
  return (
    <div className={styles.main}>
      <div className={styles.video__background}>
        <video autoPlay loop muted>
          <source src={intro} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
      <div className={styles.intro__page}>
        <div>
          <p className={styles.main__title}>Arcanum</p>
          <p className={styles.main__description}>
            Иммерсивный цифровой детектив
          </p>
        </div>
        <div className={styles.preview__wrap}>
          <Button buttonClass="buy__btn__s" buttonContent="Начать" />

        </div>
        <div className={styles.team__info}>
            <p className={styles.team__name}>Powered by</p>
            <img src={fcore} alt="" className={styles.team__logo} />
          </div>
      </div>
    </div>
  );
};
export default Intro;
