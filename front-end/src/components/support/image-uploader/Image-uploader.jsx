import styles from "./image-uploader.module.scss";

const ImageUploader = ({ name, size, preview }) => {
  return (
    <div className={styles.image__uploader}>
      <img src={preview} alt="" className={styles.image__preview} />
      <div className={styles.image__info}>
        <p className={styles.image__name}>{name}</p>
        <p className={styles.image__size}>{size} KB</p>
      </div>
      <p className={styles.cross}></p>
    </div>
  );
};
export default ImageUploader;
