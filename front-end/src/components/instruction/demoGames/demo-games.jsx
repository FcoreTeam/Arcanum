import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";

import styles from "./demo-games.module.scss";
import { api } from "../../../api/api";
import Button from "../../@ui/Button/Button";
import { useDispatch } from "react-redux";
import { openPopup } from "../../../store/slices/popupSlice";

const DemoGames = () => {
  const dispatch = useDispatch();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleTipClick = (game) => {
    dispatch(
      openPopup({
        type: "tip",
        name: game.name,
        description: game.description || "Описание отсутствует",
      })
    );
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.getDemoGames();
        setGames(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Ошибка загрузки демо-игр", err);
        setError("Ошибка при загрузке демо-игр");
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading)
    return <div className={styles.loading}>Загрузка демо-игр...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (games.length === 0) return <div className={styles.empty}></div>;

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      speed={800}
      grabCursor={true}
      className={styles.game__swiper}
      watchSlidesProgress={true}
      observer={true}
      observeParents={true}
    >
      {games.map((game) => (
        <SwiperSlide className={styles.slide} key={game.id}>
          <div className={styles.game}>
            <h3 className={styles.game__name}>{game.name}</h3>
            {game.photo_url && (
              <img
                src={game.photo_url}
                className={styles.game__preview}
                alt={game.name}
                width="100%"
                height="auto"
                loading="lazy"
              />
            )}
            <div className={styles.buttons}>
              <Button
                buttonClass="buy__btn"
                buttonContent="Играть"
                to={`/demo-game/${game.id}`}
              >
                Играть
              </Button>
              <Button
                buttonClass="buy__btn"
                buttonContent="Описание"
                secondClass="info__btn"
                onClick={() => handleTipClick(game)}
              >
                Описание
              </Button>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default DemoGames;
