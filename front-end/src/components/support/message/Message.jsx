import clsx from "clsx";
import styles from "./message.module.scss";

const Message = ({ message, isUserMessage, images }) => {
  return (
    <div className={clsx(styles.message, isUserMessage ? styles.user : "")}>
      <p className={styles.message__content}>{message}</p>
      {images && images.length > 0 && (
        <div className={styles.message__images}>
          {images.map((img, index) => (
            <img key={index} src={img.fileLink} alt={`image-${index}`} className={styles.message_image} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Message;
