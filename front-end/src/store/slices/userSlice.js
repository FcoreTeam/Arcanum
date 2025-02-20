import { createSlice } from "@reduxjs/toolkit";

const userState = {
  userName: "Пользователь 1",
  userAvatar: "",
  userPts: 1000,
};
const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {},
});
export default userSlice.reducer;
