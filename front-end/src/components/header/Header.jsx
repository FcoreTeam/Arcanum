import { useSelector } from "react-redux";
import userDefault from "../../img/userdef.svg";

import styles from "./header.module.scss";

const Header = () => {
  const { userName, userAvatar, userPts } = useSelector((state) => state.user);
  return (
    <header>
      <div className={styles.user__info}>
        <div className={styles.user__text}>
          <p className={styles.user__name}>{userName}</p>
          <p className={styles.user__pts}>{userPts} очков</p>
        </div>
        <img
          src={userAvatar === "" ? userDefault : userAvatar}
          alt=""
          className={styles.user__img}
        />
      </div>
    </header>
  );
};
export default Header;
