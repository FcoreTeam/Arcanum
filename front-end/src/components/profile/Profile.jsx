import blur from "../../img/blur__one.svg";
import pencil from "../../img/pencil.svg";
import { useSelector } from "react-redux";
import { useState } from "react";
import clsx from "clsx";
import Games from "../main/games/Games";

import styles from "./profile.module.scss";

const Profile = () => {
  const [filter, setFilter] = useState("not_passed"); // passed
  const { userAvatar, userName, userPhone, userEmail } = useSelector(
    (state) => state.user
  );

  return (
    <div className={styles.profile}>
      <img src={blur} alt="" className={styles.blur__image} />
      <div className={styles.profile__info}>
        <div
          className={clsx(
            styles.profile__avatar,
            userAvatar === "" ? styles.user__def : ""
          )}
        >
          {userAvatar !== "" ? (
            <img src={userAvatar} alt="" className={styles.user__img} />
          ) : (
            <></>
          )}
        </div>
        <p className={styles.user__name}>{userName}</p>
        <div className={styles.user__info}>{userPhone}</div>
        <div className={styles.user__info}>{userEmail}</div>
        <div className={styles.edit__btn}>
          Редактировать профиль{" "}
          <img src={pencil} alt="" className={styles.edit__img} />
        </div>
        <p className={styles.games__title}>Список игр</p>
        <div className={styles.games__controller}>
          <div
            className={clsx(
              styles.controller,
              filter === "not_passed" ? styles.active : ""
            )}
            onClick={() => setFilter("not_passed")}
          >
            Не пройденные
          </div>
          <div
            className={clsx(
              styles.controller,
              filter === "passed" ? styles.active : ""
            )}
            onClick={() => setFilter("passed")}
          >
            Пройденные
          </div>
        </div>
        <Games category={filter} />
      </div>
    </div>
  );
};
export default Profile;
