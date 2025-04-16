import { io } from "socket.io-client";
import axios from "axios";

const $api = axios.create({
  baseURL: "https://api.zoltansgametma.ru/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

export const api = {
  getCurrentUser: () => $api.get("/auth/me"),
  syncUser: () => $api.patch("/auth/me/sync"),
  updateUser: (data) => $api.patch("/auth/me/update", data),

  getGames: (params = {}) => $api.get("/games", { params }),
  getGame: (gameId) => $api.get(`/games/${gameId}`),
  getLeaders: (gameId) => $api.get(`/games/${gameId}/leaderboard`),
  sendAnswer: (data) => $api.post(`/games/${data.game_id}/answer`, {
    answer: data.answer,
    telegram_id: data.telegram_id
  }),

  setSettings: (data) => $api.post("/users/update_settings", data),
  getUserInfo: (user_id) => $api.get(`/users/user_info?user_id=${user_id}`),
  getMessages: (user_id) => $api.get(`/users/get_messages?user_id=${user_id}`),
  makeRequest: (formData) => $api.post("/users/make_request", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
    },
  }),
};

export const socket = io("https://api.zoltansgametma.ru", {
  path: "/socket.io/",
  transports: ['websocket'],
  autoConnect: false
});

export const chatApi = {
  connect: (userId) => {
    socket.connect();
    socket.emit('chat', { user_id: userId });
  },

  disconnect: () => {
    socket.disconnect();
  },

  sendMessage: (message) => {
    socket.emit('new-chat-message', { message });
  },

  onMessage: (callback) => {
    socket.on('new-chat-message', callback);
  },

  onConnect: (callback) => {
    socket.on('connect', callback);
  },

  onDisconnect: (callback) => {
    socket.on('disconnect', callback);
  },

  offMessage: (callback) => {
    socket.off('new-chat-message', callback);
  },

  offConnect: (callback) => {
    socket.off('connect', callback);
  },

  offDisconnect: (callback) => {
    socket.off('disconnect', callback);
  }
};

