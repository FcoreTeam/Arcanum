import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";

import styles from "./demo-games.module.scss";

const DemoGames = () => {
  const [demoGames, setDemoGames] = useState([]);
  return (
    <div className={styles.demo__games}>
      <Swiper
        spaceBetween={30}
        slidesPerView="1"
        loop={true}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        className={styles.game__swiper}
      ></Swiper>
    </div>
  );
};
export default DemoGames;
