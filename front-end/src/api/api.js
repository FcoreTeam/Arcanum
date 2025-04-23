import { io } from "socket.io-client";
import axios from "axios";

const $api = axios.create({
  baseURL: "http://31.172.67.162:8000/api",
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

$api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.config.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const api = {
  getCurrentUser: (user_id) => $api.get(`/auth/me?user_id=${user_id}`),
  syncUser: () => $api.patch("/auth/me/sync"),
  updateUser: (data) => $api.patch("/auth/me/update", data),

  getGames: (params = { until_today: false, limit: 2 }) => $api.get("/games/", { params }),
  getGame: (gameId) => $api.get(`/games/${gameId}`),
  getLeaders: (gameId) => $api.get(`/games/${gameId}/leaderboard`),
  sendAnswer: (data) => $api.post(`/games/${data.game_id}/answer`, {
    answer: data.answer,
    telegram_id: data.telegram_id
  }),
};

export const socket = io("https://zoltansgametma.ru", {
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
    socket.on('chat-message', callback);
  },

  onConnect: (callback) => {
    socket.on('connect', callback);
  },

  onDisconnect: (callback) => {
    socket.on('disconnect', callback);
  },

  onChatStarted: (callback) => {
    socket.on('chat-started', callback);
  },

  onChatEnded: (callback) => {
    socket.on('chat-ended', callback);
  },

  offMessage: (callback) => {
    socket.off('chat-message', callback);
  },

  offConnect: (callback) => {
    socket.off('connect', callback);
  },

  offDisconnect: (callback) => {
    socket.off('disconnect', callback);
  },

  offChatStarted: (callback) => {
    socket.off('chat-started', callback);
  },

  offChatEnded: (callback) => {
    socket.off('chat-ended', callback);
  }
};

