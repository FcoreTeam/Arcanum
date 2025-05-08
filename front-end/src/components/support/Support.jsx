import { useState, useEffect, useRef } from "react";
import Message from "./message/Message";
import Input from "../@ui/Input/Input";
import sendImage from "../../img/send.svg";
import clipImage from "../../img/clip.svg";
import supportAvatar from "../../img/support.png";
import styles from "./support.module.scss";
import { chatApi } from "../../api/api";
import { useUser } from "../../store/slices/hooks/useUser";

const Support = () => {
  const { userId } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isChatConfirmed, setIsChatConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const chatStateRef = useRef({
    isConnected: false,
    isChatConfirmed: false,
    messages: [],
  });

  useEffect(() => {
    if (!userId) return;

    const chatState = JSON.parse(localStorage.getItem("chat_state"));
    if (chatState) {
      setIsConnected(chatState.isConnected);
      setIsChatConfirmed(chatState.isChatConfirmed);
      setMessages(chatState.messages || []);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      chatApi.connect(userId);
    }

    const handleAuthSuccess = () => {
      setIsConnected(true);
      setIsLoading(false);
      saveChatState({
        isConnected: true,
        isChatConfirmed: false,
        messages: chatStateRef.current.messages,
      });
    };

    const handleNewMessage = (data) => {
      setMessages((prev) => {
        const cleaned = prev.filter(
          (msg) => !msg.id?.toString().startsWith("temp")
        );
        const newMessage = {
          id: Date.now(),
          message: data.text || "",
          is_user_message: false,
          attachments: data.photo ? [{ url: data.photo }] : [],
        };
        const updated = [...cleaned, newMessage];
        saveChatState({
          isConnected: true,
          isChatConfirmed: true,
          messages: updated,
        });
        return updated;
      });
    };

    const handleChatFound = () => {
      setIsChatConfirmed(true);
      setIsSearching(false);
      saveChatState({
        isConnected: true,
        isChatConfirmed: true,
        messages: chatStateRef.current.messages,
      });
    };

    const handleChatClosed = () => {
      setIsConnected(false);
      setIsChatConfirmed(false);
      setIsSearching(false);
      setMessages([]);
      localStorage.removeItem("chat_state");
    };

    chatApi.onAuthSuccess(handleAuthSuccess);
    chatApi.onNewMessage(handleNewMessage);
    chatApi.onChatFound(handleChatFound);
    chatApi.onChatClosed(handleChatClosed);

    return () => {
      chatApi.offAll();
    };
  }, [userId]);

  const handleStartSearch = () => {
    if (!isConnected) return;
    chatApi.startSearch();
    setIsSearching(true);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.max(e.target.scrollHeight, 45)}px`;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    const tempId = `temp-${Date.now()}`;
    const previewUrl = URL.createObjectURL(file);

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        message: "",
        is_user_message: true,
        attachments: [{ url: previewUrl }],
      },
    ]);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      await chatApi.uploadChatPhoto(formData);
    } catch (err) {
      setError("Ошибка при отправке изображения");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    }
    e.target.value = null;
  };

  const sendMessage = () => {
    if (!inputValue.trim() || !isChatConfirmed) return;

    chatApi.sendMessage(inputValue);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        message: inputValue,
        is_user_message: true,
        attachments: [],
      },
    ]);
    setInputValue("");
    textareaRef.current.style.height = "45px";
  };

  const saveChatState = (state) => {
    chatStateRef.current = state;
    localStorage.setItem("chat_state", JSON.stringify(state));
  };

  return (
    <div className={styles.support}>
      <div className={styles.support__body}>
        <div className={styles.support__header}>
          <img src={supportAvatar} alt="" className={styles.header__avatar} />
          <p className={styles.support__title}>
            {isLoading
              ? "Загрузка..."
              : isChatConfirmed
              ? "Агент поддержки"
              : isSearching
              ? "Поиск администратора..."
              : "Техническая поддержка"}
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.body__messages}>
          {messages.map((msg) => (
            <Message
              key={msg.id}
              message={msg.message}
              isUserMessage={msg.is_user_message}
              images={msg.attachments}
            />
          ))}
          <div ref={messagesEndRef} />
        </section>

        {!isChatConfirmed && isConnected && (
          <div className={styles.searchContainer}>
            <button
              onClick={handleStartSearch}
              disabled={isSearching}
              className={styles.connectButton}
            >
              {isSearching ? "Поиск..." : "Начать чат с поддержкой"}
            </button>
          </div>
        )}

        {isConnected && isChatConfirmed && (
          <div className={styles.support__footer}>
            <Input
              ref={textareaRef}
              placeholder="Введите сообщение"
              secondClass="chat__input"
              isTextArea={true}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
            />
            <img
              src={sendImage}
              alt="Send"
              className={styles.send}
              onClick={sendMessage}
            />
            <Input
              type="file"
              secondClass="upload"
              accept="image/*"
              onChange={handleFileChange}
            />
            <img src={clipImage} alt="Attach" className={styles.clip} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
