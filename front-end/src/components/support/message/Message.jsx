import clsx from "clsx";

import styles from "./message.module.scss";

const Message = ({ message, isUserMessage }) => {
  return (
    <div className={clsx(styles.message, isUserMessage ? styles.user : " ")}>
      <p className={styles.message__content}>{message}</p>
    </div>
  );
};
export default Message;
