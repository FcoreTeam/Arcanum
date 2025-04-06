import { io } from "socket.io-client";

import axios from "axios";

const $api = axios.create({
  baseURL: "https://api.zoltansgametma.ru",
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Мок-данные для таблицы лидеров
const mockLeadersData = {
  1: {
    success: true,
    leaderboard: [
      {
        id: 1,
        user_id: 123456,
        game_id: 1,
        is_rewarded: true,
        created_at: "2024-03-20T10:00:00Z",
        username: "kristina228",
        first_name: "Игрок 1",
      },
      {
        id: 2,
        user_id: 234567,
        game_id: 1,
        is_rewarded: true,
        created_at: "2024-03-20T10:05:00Z",
        username: "player2",
        first_name: "Игрок 2",  
      },
      {
        id: 3,
        user_id: 345678,
        game_id: 1,
        is_rewarded: false,
        created_at: "2024-03-20T10:10:00Z",
        username: "player3",
        first_name: "Игрок 3",  
      }
    ]
  },
  2: {
    success: true,
    leaderboard: [
      {
        id: 4,
        user_id: 456789,
        game_id: 2,
        is_rewarded: true,
        created_at: "2024-03-21T11:00:00Z",
        username: "player4",
        first_name: "Игрок 4",
      },
      {
        id: 5,
        user_id: 567890,
        game_id: 2,
        is_rewarded: false,
        created_at: "2024-03-21T11:15:00Z",
        username: "player5",
        first_name: "Игрок 5",
      }
    ]
  },
  3: {
    success: true,
    leaderboard: [
      {
        id: 6,
        user_id: 678901,
        game_id: 3,
        is_rewarded: true,
        created_at: "2024-03-22T12:00:00Z",
        username: "player6",
        first_name: "Игрок 6",
      },
      {
        id: 7,
        user_id: 789012,
        game_id: 3,
        is_rewarded: true,
        created_at: "2024-03-22T12:10:00Z",
        username: "player7",
        first_name: "Игрок 7",
      },
      {
        id: 8,
        user_id: 890123,
        game_id: 3,
        is_rewarded: false,
        created_at: "2024-03-22T12:20:00Z",
        username: "player8",
        first_name: "Игрок 8",
      }
    ]
  }
};

// export const api = {
//   getLeaders: (gameId) => $api.post("/leaderboard/getleaderboard"),

export const api = {
  getLeaders: (gameId) => {
    const leaders = mockLeadersData[gameId] || { success: true, leaderboard: [] };
    return Promise.resolve({ data: leaders });
  },
  getGame: () => $api.get("/games/getgame"),
  getGames: () => $api.get("/games/getgames"),
  sendAnswer: (data) => $api.post("/games/answergame", data),
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

export const socket = io("ws://localhost:5000", {
  path: "/socket.io/",
});

