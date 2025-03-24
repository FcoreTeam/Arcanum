import { useEffect, useState } from "react";
import Player from "./player/Player";
import GameLine from "./game-line/Game-line";
import clsx from "clsx";
import { api } from "../../api/api"

import styles from "./leads.module.scss";


const Leads = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await api.getLeaders();
        setLeaders(response.data.slice(0, 5));
      } catch (err) {
        setError("Ошибка загрузки таблицы лидеров");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

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
            {loading ? (
              <p className={styles.loading}>Загрузка...</p>
            ) : error ? (
              <p className={styles.error}>{error}</p>
            ) : leaders.length > 0 ? (
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
