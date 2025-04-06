import { useEffect, useState } from "react";
import Player from "./player/Player";
import GameLine from "./game-line/Game-line";
import clsx from "clsx";
import { api } from "../../api/api"
import { useParams } from "react-router-dom";

import styles from "./leads.module.scss";

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const Leads = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { gameId } = useParams();

  console.log(gameId)

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        if (!gameId) {
          setError("ID игры не указан");
          setLoading(false);
          return;
        }

        const response = await api.getLeaders(gameId);
        if (response.data?.success) {
          setLeaders(response.data.leaderboard);
        } else {
          setError("Ошибка загрузки таблицы лидеров");
        }
      } catch (err) {
        setError("Ошибка загрузки таблицы лидеров");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, [gameId]);

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
              leaders.map((leader, index) => (
                <Player 
                  key={leader.id} 
                  place={index + 1}
                  name={leader.username || leader.first_name || "Игрок"}
                  time={formatTime(leader.created_at)}
                  points={leader.points || 0}
                />
              ))
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
