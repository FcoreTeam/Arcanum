import blur from "../../img/blur__one.svg";

import styles from "./instruction.module.scss";

const Instruction = () => {
  return (
    <div className={styles.instruction}>
      <img src={blur} alt="" className={styles.blur__image} />
      <img src={blur} alt="" className={styles.blur__image__sec} />
      <div className={styles.body}>
        <p className={styles.instruction__title}>Инструкция к игре</p>
        <p className={styles.instruction__text}>
          Текст с инструкцией. важные моменты выделяются <span>Цветом</span>
        </p>
      </div>
    </div>
  );
};
export default Instruction;
