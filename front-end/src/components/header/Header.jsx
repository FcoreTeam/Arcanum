import { useSelector } from "react-redux";
import { Link } from "react-router";
import userDefault from "../../img/userdef.svg";
import clsx from "clsx";

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
        <Link
          to="/profile"
          className={clsx(
            styles.link__profile,
            userAvatar === "" ? styles.user__def : ""
          )}
        >
          {userAvatar !== "" ? <img src={userAvatar} alt="" className={styles.user__img} /> : <></>}
        </Link>
      </div>
    </header>
  );
};
export default Header;
