import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { api } from "../../../api/api";
import { useNavigate } from "react-router-dom";

import styles from "./game-line.module.scss";

const GameLine = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await api.getGames();

        if (response.data?.success && Array.isArray(response.data.games)) {
          const cleanedGames = response.data.games.map((game) => ({
            ...game,
            preview_url: game.preview_url?.replace(/"/g, ""),
            dateObj: new Date(game.date),
          }));

          setGames(cleanedGames);
        } else {
          setError("Неверный формат данных");
        }
      } catch (err) {
        console.error("Ошибка загрузки:", err);
        setError("Ошибка загрузки игр");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleSlideClick = (gameId) => {
    navigate(`/lead/${gameId}`);
  };

  if (loading) return <div className={styles.loading}>Загрузка игр...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView="2"
      loop={true}
      scrollbar={{ draggable: true }}
      className={styles.game__swiper}
    >
      {games.map((game) => (
        <SwiperSlide
          key={game.id}
          className={clsx(styles.game)}
          onClick={() => handleSlideClick(game.id)}
        >
          {game.name}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default GameLine;
