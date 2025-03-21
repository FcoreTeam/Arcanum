import { Cookies } from "js-cookie";
import { io } from "socket.io";

import axios from "axios";

const $api = axios.create({
  baseURL: "http://api.zoltansgametma.ru",
  timeout: 10000,
});

export const getUserInfo = async () =>
  $api.get("/user/user_info").catch((err) => console.log(err));

export const getGames = async () =>
  $api.get("game/getgames").catch((err) => console.log(err));

export const getGame = async () =>
  $api.get("/game/getGame").catch((err) => console.log(err));

export const sendAnswer = async (data) =>
  $api
    .post("/answergame", data)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

export const getLeaders = async () =>
  $api.get("/getleaderboard").catch((err) => console.log(err));

export const setSettings = async (data) =>
  $api
    .put("/update_settings", data, { withCredentials: true })
    .catch((err) => console.log(err));

export const socket = io("ws://localhost:3001", {
  path: "/socket.io/",
  extraHeaders: {
    Authorization: `Bearer ${Cookies.get("accessToken")}`,
  },
});
