import styles from "./message.module.scss";

const Message = ({ message }) => {
  return (
    <div className={styles.message}>
      <p className={styles.message__content}>{message}</p>
    </div>
  );
};
export default Message;
