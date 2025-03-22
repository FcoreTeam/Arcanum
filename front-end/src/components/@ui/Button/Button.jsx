import clsx from "clsx";

import styles from "./button.module.scss";

const Button = ({ buttonContent, buttonClass, onClick, secondClass }) => {
  return (
    <button
      className={clsx(styles.button, styles[buttonClass], styles[secondClass])}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
};
export default Button;
