import Popup from "../Popup";
import clsx from "clsx";
import { useSelector, useDispatch } from "react-redux";
import Agreement from "../../../docs/agreement.txt";
import { closePopup } from "../../../store/slices/popupSlice";

import styles from "./rules-popup.module.scss";
import Button from "../../@ui/Button/Button";

const RulesPopup = () => {
  const dispatch = useDispatch();
  const { isOpen, popupType } = useSelector((state) => state.popup.generalInfo);

  return (
    <Popup>
      <div
        className={clsx(
          styles.popup,
          isOpen &&
            popupType === "rules" &&
            !localStorage.getItem("before") &&
            styles.open
        )}
      >
        <p className={styles.popup__name}>Добро пожаловать</p>
        <p className={styles.popup__description}>
          Чтобы начать проходить игры, вам необходимо согласится с правилами.
        </p>
        <a download={true} href={Agreement}>
          Скачать правила
        </a>
        <Button
          buttonContent="Я согласен с правилами"
          secondClass="buy__btn"
          onClick={() => {
            dispatch(closePopup());
            localStorage.setItem("before", true);
          }}
        />
      </div>
    </Popup>
  );
};
export default RulesPopup;
