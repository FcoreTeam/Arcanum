import clsx from "clsx";
import { Link } from "react-router-dom";
import styles from "./button.module.scss";

const Button = ({
  buttonContent,
  buttonClass,
  secondClass,
  onClick,
  to,
}) => {
  const classNames = clsx(
    styles.button,
    styles[buttonClass],
    styles[secondClass]
  );

  if (to) {
    return (
      <Link to={to} className={classNames}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button className={classNames} onClick={onClick}>
      {buttonContent}
    </button>
  );
};

export default Button;
