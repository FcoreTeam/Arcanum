import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState } from "react";
import styles from "./games.module.scss";
import Button from "../../@ui/Button/Button";
import { api } from "../../../api/api";
import React from "react";

const Games = ({ category }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.getGames();
        if (response?.data) {
          setGames(response.data);
        }
      } catch (error) {
        console.log("Ошибка загрузки игр:", error);
      }
    };

    fetchGames();
  }, []);

  const filteredGames = games.filter((item) => item.gameState === category);

  return (
    <Swiper
      spaceBetween={30}
      slidesPerView={1}
      loop={true}
      className={styles.game__swiper}
    >
      {filteredGames.map((item, index) => (
        <SwiperSlide key={index} className={styles.game}>
          <p className={styles.game__name}>{item.gameName}</p>
          <p className={styles.game__date}>{item.gameDate}</p>
          <img
            src={item.gamePreview}
            alt="preview"
            className={styles.game__preview}
          />
          <div className={styles.game__btns}>
            {category === "not_passed" ? (
              <Button buttonClass="buy__btn__w" buttonContent="Играть" />
            ) : (
              <>
                <Button buttonClass="buy__btn" buttonContent="Перепройти" />
                <Button
                  buttonClass="buy__btn"
                  buttonContent="Статистика"
                  secondClass="info__btn"
                />
              </>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Games;
