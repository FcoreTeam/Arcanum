import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from "react-redux";

import styles from "./games.module.scss";
import Button from "../../@ui/Button/Button";

const Games = ({ category }) => {
  const { games } = useSelector((state) => state.games);
  const { userGames } = useSelector((state) => state.user);
  return (
    <Swiper
      spaceBetween={30}
      slidesPerView="1"
      loop={true}
      scrollbar={{ draggable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      className={styles.game__swiper}
    >
      {category === "not_passed" || category === "passed"
        ? userGames
            .filter((item) => item.gameState === category)
            .map((item, index) => (
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
                      <Button
                        buttonClass="buy__btn"
                        buttonContent="Перепройти"
                      />
                      <Button
                        buttonClass="buy__btn"
                        buttonContent="Статистика"
                        secondClass="info__btn"
                      />
                    </>
                  )}
                </div>
              </SwiperSlide>
            ))
        : games
            .filter((item) => item.gameState === category)
            .map((item, index) => (
              <SwiperSlide key={index} className={styles.game}>
                <p className={styles.game__name}>{item.gameName}</p>
                <p className={styles.game__date}>{item.gameDate}</p>
                <img
                  src={item.gamePreview}
                  alt="preview"
                  className={styles.game__preview}
                />
                <div className={styles.game__btns}>
                  <Button
                    buttonClass="buy__btn"
                    buttonContent={item.gamePrice + " ₽"}
                  />
                  <Button
                    buttonClass="buy__btn"
                    buttonContent="Инфо"
                    secondClass="info__btn"
                  />
                </div>
              </SwiperSlide>
            ))}
    </Swiper>
  );
};
export default Games;
