import { useState, useEffect, useRef } from "react";
import Message from "./message/Message";
import Input from "../@ui/Input/Input";
import sendImage from "../../img/send.svg";
import clipImage from "../../img/clip.svg";
import supportAvatar from "../../img/support.png";
import styles from "./support.module.scss";
import ImageUploader from "./image-uploader/Image-uploader";
import { chatApi } from "../../api/api";
import { useUser } from "../../store/slices/hooks/useUser";

const Support = () => {
  const { userId } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (userId) {
      setupChat();
    }
    return () => {
      chatApi.disconnect();
      chatApi.offAll();
    };
  }, [userId]);

  const setupChat = () => {
    chatApi.connect(userId);

    chatApi.onAuthSuccess(() => {
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      console.log("Успешная аутентификация!");
    });

    chatApi.onNewMessage((data) => {
      if (data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            message: data.text,
            is_user_message: false,
            attachments: [],
          },
        ]);
      }
    });

    chatApi.disconnect(() => {
      setIsConnected(false);
      setError("Соединение с чатом потеряно");
      setIsLoading(false);
      console.log("Отключен")
    });

    chatApi.startSearch(() => {
      setIsConnected(true);
      setError(null);
      setIsLoading(false);
      console.log("поиск начался")
    });

    chatApi.onError((error) => {
      console.error("Ошибка WebSocket:", error);
      setError("Ошибка соединения");
      setIsLoading(false);
    });

    chatApi.onChatClosed(() => {
      setIsConnected(false);
      setError("Чат завершен администратором");
      setIsLoading(false);
      console.log("Чат закрыт")
    });

    console.log(isConnected)

    chatApi.sendMessage((data) => {
      if (data.content) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          message: data.content,
          is_user_message: false,
          attachments: []
        }]);
      }
    }, [userId]);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

    event.target.style.height = "auto";
    const newHeight = Math.max(event.target.scrollHeight, 45);
    event.target.style.height = `${newHeight}px`;
  };

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
          file: file
        },
      ]);

      event.target.value = null;
    }
  };

  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const canSendMessage = !!inputValue.trim() || !!images.length;

  const sendMessage = () => {
    if (!canSendMessage || !userId) return;

    try {
      chatApi.sendMessage(inputValue);
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        message: inputValue,
        is_user_message: true,
        attachments: images.map(img => ({ url: img.fileLink }))
      }]);
      
      setInputValue("");
      setImages([]);
      setError(null);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = "45px";
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      setError("Ошибка при отправке сообщения");
    }
  };

  return (
    <div className={styles.support}>
      <div className={styles.support__body}>
        <div className={styles.support__header}>
          <img src={supportAvatar} alt="" className={styles.header__avatar} />
          <p className={styles.support__title}>
            {isLoading ? "Загрузка..." : isConnected ? "Агент поддержки" : "Вы не подключены к чату"}
          </p>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <section className={styles.body__messages}>
          {messages.map((item) => (
            <Message
              key={item.id}
              message={item.message}
              isUserMessage={item.is_user_message}
              images={item.attachments}
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
              onDelete={() => handleDeleteImage(index)}
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
          {canSendMessage && (
            <img
              src={sendImage}
              alt=""
              className={styles.send}
              onClick={sendMessage}
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