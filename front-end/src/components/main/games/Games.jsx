import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import styles from "./games.module.scss";
import Button from "../../@ui/Button/Button";
import { api } from "../../../api/api";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import React from "react";

const Games = ({ category }) => {
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
        setError("Не удалось загрузить игры");
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const now = new Date().getTime();

  const filteredGames = games.filter((game) => {
    if (category === "all") return true;
    if (category === "test") return game.is_test;

    console.log(game.date);
    const [day, month, year] = game.date.split(".").map(Number);
    const jsMonth = month - 1;

    const date = new Date(year, jsMonth, day);
    const unixTime = date.getTime();

    const isPast = unixTime < now;
    return category === "prev"
      ? isPast && !game.is_test
      : !isPast && !game.is_test;
  });

  if (loading) return <div className={styles.loading}>Загрузка игр...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (filteredGames.length === 0) {
    return <div className={styles.empty}>Нет игр в этой категории</div>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      breakpoints={{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      speed={800}
      grabCursor={true}
      className={styles.game__swiper}
    >
      {filteredGames.map((game) => (
        <SwiperSlide className={styles.slide} key={game.id}>
          <div className={styles.game}>
            <h3 className={styles.game__name}>{game.name}</h3>
            <p className={styles.game__date}>Дата: {game.date}</p>

            {game.preview_url && (
              <img
                src={game.preview_url}
                className={styles.game__preview}
                width="298"
                height="198"
                alt={game.name}
              />
            )}

            <div className={styles.buttons}>
              <Button buttonContent={game.price + " ₽"} buttonClass="buy__btn">
                {category === "prev" ? "Перепройти" : "Играть"}
              </Button>
              <Button
                buttonClass="buy__btn"
                buttonContent="Инфо"
                secondClass="info__btn"
              >
                Описание игры
              </Button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Games;
