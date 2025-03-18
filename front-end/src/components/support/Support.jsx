import { useState, useEffect, useRef } from "react";
import Message from "./message/Message";
import Input from "../@ui/Input/Input";
import sendImage from "../../img/send.svg";
import clipImage from "../../img/clip.svg";
import supportAvatar from "../../img/support.png";

import styles from "./support.module.scss";
import ImageUploader from "./image-uploader/Image-uploader";

const Support = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      isUserMessage: false,
      message: "Текст сообщения",
    },
    {
      id: 2,
      isUserMessage: true,
      message: "Здравствуйте!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState([]); // Состояние для хранения загруженных изображений
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Реф для input type="file"

  // Автоматическая прокрутка вниз при изменении сообщений
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Автоматическое изменение высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "45px";
      const currentScrollHeight = textareaRef.current.scrollHeight;
      if (currentScrollHeight > 45) {
        textareaRef.current.style.height = `${currentScrollHeight}px`;
      }
    }
  }, []);

  // Обработчик изменения текста в textarea
  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);

    event.target.style.height = "auto";
    const newHeight = Math.max(event.target.scrollHeight, 45);
    event.target.style.height = `${newHeight}px`;
  };

  // Обработчик загрузки изображений
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImages((prevImages) => [
        ...prevImages,
        {
          fileName: file.name,
          fileLink: fileURL,
          fileSize: (file.size / 1024).toFixed(2),
        },
      ]);

      event.target.value = null;
    }
  };

  const sendMessage = (text) => {
    const newMessage = {
      id: messages.length + 1,
      isUserMessage: true,
      message: text,
    };
    setMessages([...messages, newMessage]);
    setInputValue("");
  };

  return (
    <div className={styles.support}>
      <div className={styles.support__body}>
        <div className={styles.support__header}>
          <img src={supportAvatar} alt="" className={styles.header__avatar} />
          <p className={styles.support__title}>Агент поддержки</p>
        </div>
        <section className={styles.body__messages}>
          {messages.map((item) => (
            <Message
              key={item.id}
              message={item.message}
              isUserMessage={item.isUserMessage}
            />
          ))}
          <div ref={messagesEndRef} />
        </section>
        <div className={styles.image__wrap}>
          {images.map((item, index) => (
            <ImageUploader
              key={index}
              name={item.fileName}
              size={item.fileSize}
              preview={item.fileLink}
            />
          ))}
        </div>

        <div className={styles.support__footer}>
          <Input
            ref={textareaRef}
            placeholder="Введите сообщение"
            secondClass="chat__input"
            isTextArea={true}
            value={inputValue}
            onChange={handleInputChange}
          />
          {inputValue.length !== 0 && (
            <img
              src={sendImage}
              alt=""
              className={styles.send}
              onClick={() => sendMessage(inputValue)}
            />
          )}
          <Input
            type="file"
            secondClass="upload"
            accept="image/*"
            onChange={handleFileChange}
          />
          <img src={clipImage} alt="" className={styles.clip} />
        </div>
      </div>
    </div>
  );
};

export default Support;
