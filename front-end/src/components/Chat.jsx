import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedImage) return;

    const formData = new FormData();
    formData.append("message", newMessage);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/messages",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
      setSelectedImage(null);
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            {message.text && <p>{message.text}</p>}
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Отправленное изображение"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default Chat;
