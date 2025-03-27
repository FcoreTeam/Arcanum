import { io } from "socket.io-client";

import axios from "axios";

const $api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  withCredentials: true,
});

export const api = {
  getLeaders: (gameId) => $api.post("/leaderboard/getleaderboard"),
  getGame: () => $api.get("/games/getgame"),
  getGames: () => $api.get("/games/getgames"),
  sendAnswer: (data) => $api.post("/games/answergame", data),
  setSettings: (data) => $api.post("/users/update_settings", data),
  getUserInfo: (user_id) => $api.get(`/users/user_info?user_id=${user_id}`),
};

export const socket = io("ws://localhost:5000", {
  path: "/socket.io/",
});
