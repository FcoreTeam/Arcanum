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
import { socket } from "../../api/api";

const Support = () => {
  const { userId } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isChatConfirmed, setIsChatConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    const chatState = JSON.parse(localStorage.getItem("chat_state"));

    if (chatState) {
      if (chatState.isConnected) setIsConnected(true);
      if (chatState.isChatConfirmed) setIsChatConfirmed(true);
      if (chatState.messages) setMessages(chatState.messages);
    }

    chatApi.connect(userId);

    chatApi.onAuthSuccess(() => {
      setIsConnected(true);
      setIsLoading(false);
      saveChatState({ isConnected: true, isChatConfirmed, messages });
      console.log("AUTH SUCCESS");

      if (!isChatConfirmed) {
        chatApi.startSearch();
        console.log("Start Search")
      }
    });

    chatApi.onNewMessage((data) => {
      if (data.text || data.photo) {
        setMessages((prev) => {
          const withoutTemp = prev.filter((msg) => !(msg.id && msg.id.toString().startsWith("temp")));
    
          const updatedMessages = [
            ...withoutTemp,
            {
              id: Date.now(),
              message: data.text || "",
              is_user_message: false,
              attachments: data.photo ? [{ url: data.photo }] : [],
            },
          ];
    
          localStorage.setItem("chat_state", JSON.stringify({ isConnected: true, messages: updatedMessages }));
          return updatedMessages;
        });
        console.log("NEW MESSAGE:", data);
      }
    });
    

    chatApi.onChatClosed(() => {
      setIsConnected(false);
      setIsChatConfirmed(false);
      setMessages([]);
      setImages([]);
      localStorage.removeItem("chat_state");
      console.log("CHAT CLOSED");
    });

    return () => {
      chatApi.offAll();
    };
  }, [userId, isChatConfirmed]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  chatApi.onChatFound(() => {
    console.log("Chat found callback triggered");
    setIsChatConfirmed(true);
    saveChatState({ isConnected, isChatConfirmed: true, messages });
    console.log("CHAT FOUND");
  });

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    event.target.style.height = "auto";
    event.target.style.height = `${Math.max(event.target.scrollHeight, 45)}px`;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !userId) return;
  
    const previewUrl = URL.createObjectURL(file);
    const tempId = `temp-${Date.now()}`;
  
    const tempMessage = {
      id: tempId,
      message: "",
      is_user_message: true,
      attachments: [{ url: previewUrl }],
    };
  
    setMessages((prev) => {
      const updated = [...prev, tempMessage];
      localStorage.setItem("chat_state", JSON.stringify({ isConnected, messages: updated }));
      return updated;
    });
  
    const formData = new FormData();
    formData.append("photo", file);
  
    try {
      await chatApi.uploadChatPhoto(formData, socket.id);
      console.log("Изображение отправлено!");
    } catch (err) {
      console.error("Ошибка при отправке изображения:", err);
      setError("Ошибка при отправке изображения");
    }
  
    event.target.value = null;
  };
  

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const canSendMessage = (!!inputValue.trim() || images.length > 0) && isConnected && isChatConfirmed;

  const sendMessage = () => {
    if (!canSendMessage) return;

    chatApi.sendMessage(inputValue);

    const newMsg = {
      id: Date.now(),
      message: inputValue,
      is_user_message: true,
      attachments: images.map((img) => ({ url: img.fileLink })),
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      saveChatState({ isConnected, isChatConfirmed, messages: updated });
      return updated;
    });

    setInputValue("");
    setImages([]);
    setError(null);
    if (textareaRef.current) textareaRef.current.style.height = "45px";
  };

  const saveChatState = ({ isConnected, isChatConfirmed, messages }) => {
    localStorage.setItem(
      "chat_state",
      JSON.stringify({ isConnected, isChatConfirmed, messages })
    );
  };

  console.log(canSendMessage)

  return (
    <div className={styles.support}>
      <div className={styles.support__body}>
        <div className={styles.support__header}>
          <img src={supportAvatar} alt="" className={styles.header__avatar} />
          <p className={styles.support__title}>
            {isLoading
              ? "Загрузка..."
              : !isConnected
              ? "Вы не подключены к чату"
              : !isChatConfirmed
              ? "Ожидание администратора..."
              : "Агент поддержки"}
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
