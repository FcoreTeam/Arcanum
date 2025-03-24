import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import pencil from "../../img/pencil.svg";
import Games from "../main/games/Games";
import { api } from "../../api/api";
import styles from "./profile.module.scss";

const Profile = () => {
  const dispatch = useDispatch();
  const { userAvatar, userName } = useSelector((state) => state.user);
  const [filter, setFilter] = useState("not_passed");
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    api
      .getUserInfo()
      .then(({ data }) => {
        setPhone(data.userPhone);
        setEmail(data.userEmail);
        dispatch({
          type: "SET_USER",
          payload: data,
        });
      })
      .catch((err) => console.error("Ошибка загрузки пользователя:", err));
  }, [dispatch]);

  const handleSave = async () => {
    try {
      await api.setSettings({ userPhone: phone, userEmail: email });
      dispatch({
        type: "UPDATE_USER",
        payload: { userPhone: phone, userEmail: email },
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка сохранения настроек:", err);
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
            <img src={userAvatar} alt="" className={styles.user__img} />
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
