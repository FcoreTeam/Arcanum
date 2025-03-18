import clsx from "clsx";

import styles from "./player.module.scss";

const Player = ({ place, name, time, pts }) => {
  return (
    <div
      className={clsx(
        styles.player,
        place === 1
          ? styles.first
          : place === 2
          ? styles.second
          : place === 3
          ? styles.third
          : null
      )}
    >
      <p className={styles.place}>{place}</p>
      <p className={styles.name}>{name}</p>
      <p className={styles.time}>{time}</p>
      <p className={styles.pts}>{pts}</p>
    </div>
  );
};
export default Player;
