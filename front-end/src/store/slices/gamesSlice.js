import { createSlice } from "@reduxjs/toolkit";

const gamesState = {
  games: [
    {
      gameState: "prev",
      gameName: "Игра 1",
      gameDescription: "Описание",
      gameDate: "22 августа 2024 года",
      gamePreview: "",
      gamePrice: 0,
    },
    {
      gameName: "Игра 2",
      gameState: "prev",
      gameDescription: "Описание",
      gameDate: "23 августа 2024 года",
      gamePreview: "",
      gamePrice: 0,
    },
    {
      gameName: "Игра 3",
      gameState: "upcome",
      gameDescription: "Описание",
      gameDate: "24 августа 2024 года",
      gamePreview: "",
      gamePrice: 0,
    },
    {
      gameName: "Игра 4",
      gameState: "upcome",
      gameDescription: "Описание",
      gameDate: "25 августа 2024 года",
      gamePreview: "",
      gamePrice: 0,
    },
  ],
};
const gamesSlice = createSlice({
  name: "games",
  initialState: gamesState,
  reducers: {},
});
export default gamesSlice.reducer;
