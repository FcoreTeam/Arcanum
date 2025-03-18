import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";
import clsx from "clsx";

import styles from "./game-line.module.scss";

const GameLine = () => {
  const [gameNav, setGameNav] = useState([
    { gameName: "Игра 1", isActive: false },
    { gameName: "Игра 2", isActive: false },
    { gameName: "Игра 3", isActive: false },
    { gameName: "Игра 4", isActive: false },
    { gameName: "Игра 5", isActive: true },
  ]);

  const handleSlideClick = (index) => {
    const updatedGameNav = gameNav.map((item, i) => ({
      ...item,
      isActive: i === index,
    }));
    setGameNav(updatedGameNav);
  };

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView="2"
      loop={true}
      scrollbar={{ draggable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      className={styles.game__swiper}
    >
      {[...gameNav].reverse().map((item, index) => (
        <SwiperSlide
          key={index}
          className={clsx(styles.game, item.isActive ? styles.active : "")}
          onClick={() => handleSlideClick(gameNav.length - 1 - index)}
        >
          {item.gameName}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default GameLine;
