class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = new WebSocket(`ws://localhost:3001/ws?userId=${userId}`);

    this.socket.onopen = () => {
      console.log("WebSocket соединение установлено");
      this.notifyListeners("connection", { status: "connected" });
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.notifyListeners("message", message);
    };

    this.socket.onclose = () => {
      console.log("WebSocket соединение закрыто");
      this.notifyListeners("connection", { status: "disconnected" });
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
      this.notifyListeners("error", error);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  notifyListeners(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }
}

export const websocketService = new WebSocketService();
