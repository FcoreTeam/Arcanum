import { useEffect, useState } from "react";
import clsx from "clsx";
import pencil from "../../img/pencil.svg";
import Games from "../main/games/Games";
import styles from "./profile.module.scss";
import { useUser } from "../../store/slices/hooks/useUser";
import {api} from "../../api/api"

const Profile = () => {
  const {
    userName,
    userAvatar,
    userId,
    setUser,
    userPhone,
    userEmail,
    ...user
  } = useUser();

  const [filter, setFilter] = useState("not_passed");
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(String(userPhone));
  const [email, setEmail] = useState(String(userEmail));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      await api.setSettings("/users/update_settings", {
        userPhone: phone,
        userEmail: email,
      });

      setUser({
        ...user,
        userPhone: phone,
        userEmail: email,
      });

      setIsEditing(false);
    } catch (err) {
      setError("Ошибка сохранения настроек");
    } finally {
      setLoading(false);
    }
  };
  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 11) {
      setPhone(value);
    }
  };

  return (
    <div className={styles.profile}>
      <div className={styles.profile__info}>
        <div
          className={clsx(
            styles.profile__avatar,
            !userAvatar && styles.user__def
          )}
        >
          {userAvatar && (
            <img src={userAvatar} alt="" className={styles.profile__avatar} /> 
          )}
        </div>
        <p className={styles.user__name}>{userName}</p>

        {isEditing ? (
          <>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              className={styles.input}
              placeholder="Введите номер телефона"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Введите email"
            />
            <button className={styles.save__btn} onClick={handleSave}>
              Сохранить
            </button>
          </>
        ) : (
          <>
            <div className={styles.user__info}>{phone}</div>
            <div className={styles.user__info}>{email}</div>
          </>
        )}

        <div
          className={styles.edit__btn}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Отмена" : "Редактировать профиль"}
          {!isEditing && (
            <img src={pencil} alt="" className={styles.edit__img} />
          )}
        </div>

        <p className={styles.games__title}>Список игр</p>
        <div className={styles.games__controller}>
          <div
            className={clsx(
              styles.controller,
              filter === "not_passed" && styles.active
            )}
            onClick={() => setFilter("not_passed")}
          >
            Не пройденные
          </div>
          <div
            className={clsx(
              styles.controller,
              filter === "passed" && styles.active
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
