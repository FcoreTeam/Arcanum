import { useState } from "react";
import Player from "./player/Player";
import GameLine from "./game-line/Game-line";
import clsx from "clsx";

import styles from "./leads.module.scss";

const INITIAL_LEADS = [
  { place: 1, name: "Игрок", time: "01:02", pts: "3k" },
  { place: 2, name: "Игрок", time: "02:12", pts: "2k" },
  { place: 3, name: "Игрок", time: "03:57", pts: "1.5k" },
  { place: 4, name: "Игрок", time: "05:10", pts: "1k" },
  { place: 5, name: "Игрок", time: "07:54", pts: "500" },
];

const Leads = () => {
  const [leaders, setLeaders] = useState(INITIAL_LEADS);

  return (
    <div className={styles.leads}>
      <div className={styles.leads__body}>
        <div className={styles.leads__header}>
          <p className={styles.leads__title}>Таблица лидеров</p>

          <div className={styles.game__line}>
            <GameLine />
          </div>
        </div>

        <section className={styles.table}>
          <div className={styles.table__header}>
            <p className={clsx(styles.table__place, styles.first)}>Место</p>
            <p className={clsx(styles.table__place, styles.second)}>
              Имя игрока
            </p>
            <p className={clsx(styles.table__place, styles.third)}>Время</p>
            <p className={clsx(styles.table__place, styles.fourth)}>Очки</p>
          </div>

          <div className={styles.table__body}>
            {leaders.length !== 0 ? (
              leaders.map((item, index) => <Player key={index} {...item} />)
            ) : (
              <div className={styles.leaders__empty}>Лидеров пока нет</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Leads;
