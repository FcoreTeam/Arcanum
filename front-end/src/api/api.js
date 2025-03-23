import Cookies from "js-cookie";
import { io } from "socket.io-client";

import axios from "axios";

const $api = axios.create({
  baseURL: "https://api.zoltansgametma.ru/api",
  timeout: 10000,
  withCredentials: true,
});

export const api = {
  getLeaders: (gameId) => $api.post("/getleaderboard"),
  getGame: () => $api.get("/game/getGame"),
  getGames: () => $api.get("/game/getgames"),
  sendAnswer: (data) => $api.post("/answergame", data),
  setSettings: (data) => $api.put("/update_settings", data),
  getUserInfo: () => $api.get("/user/user_info"),
};

export const socket = io("wss://api.zoltansgametma.ru/api", {
  path: "/socket.io/",
  extraHeaders: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});
