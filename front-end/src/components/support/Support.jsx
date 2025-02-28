import { useState, useEffect, useRef } from "react";
import Message from "./message/Message";
import Input from "../@ui/Input/Input";
import sendImage from "../../img/send.svg";
import clipImage from "../../img/clip.svg";
import supportAvatar from "../../img/support.png";

import styles from "./support.module.scss";

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "45px";
      const currentScrollHeight = textareaRef.current.scrollHeight;
      if (currentScrollHeight > 45) {
        textareaRef.current.style.height = `${currentScrollHeight}px`;
      }
    }
  }, []);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);

    // Автоподстройка высоты
    event.target.style.height = "auto";
    const newHeight = Math.max(event.target.scrollHeight, 45);
    event.target.style.height = `${newHeight}px`;
  };

  return (
    <div className={styles.support}>
      <div className={styles.support__body}>
        <div className={styles.support__header}>
          <img src={supportAvatar} alt="" className={styles.header__avatar} />
          <p className={styles.support__title}>Агент поддержки</p>
        </div>
        <section className={styles.body__messages}>
          {messages.map((item, index) => (
            <Message key={index} message={item} />
          ))}
        </section>

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
            <img src={sendImage} alt="" className={styles.send} />
          )}
          <Input type="file" secondClass="upload" />
          <img src={clipImage} alt="" className={styles.clip} />
        </div>
      </div>
    </div>
  );
};
export default Support;
