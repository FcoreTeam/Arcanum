import clsx from "clsx";

import styles from "./player.module.scss";
import { useUser } from "../../../store/slices/hooks/useUser";


const PLACE_STYLES = {
  1: styles.first,
  2: styles.second,
  3: styles.third,
};

const Player = ({ place, name, time, pts }) => {
  const {...user} = useUser()
  return (
    <div className={clsx(styles.player, PLACE_STYLES[place])}>
      <p className={styles.place}>{place}</p>
      <p className={styles.name}>{name}</p>
      <p className={styles.time}>{time}</p>
      <p className={styles.pts}>{pts}</p>
    </div>
  );
};
export default Player;
