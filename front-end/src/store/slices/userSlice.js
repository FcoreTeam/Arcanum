import { createSlice } from "@reduxjs/toolkit";

const userState = {
  userName: "Пользователь 1",
  userAvatar: "",
  userPts: 1000,
  userPhone: "Телефон не привязан",
  userEmail: "Почта не привязана",
  userGames: [
    {
      gameState: "not_passed",
      gameName: "Игра 2",
      gameDescription: "Описание",
      gameDate: "23 августа 2024 года",
      gamePreview: "",
      gamePrice: 0,
    },
    {
      gameState: "passed",
      gameName: "Игра 1",
      gameDescription: "Описание",
      gameDate: "22 августа 2024 года",
      gamePreview: "",
      gamePrice: 0,
    },
    
  ],
};
const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {},
});
export default userSlice.reducer;
