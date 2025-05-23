import { createSlice } from "@reduxjs/toolkit";

const userState = {
  userName: "username",
  userAvatar: "",
  userPts: "",
  userPhone: "",
  userEmail: "",
  userGames: [],
  userId: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: userState,
  reducers: {
    updateUserData: (state, action) => ({
      ...state,
      ...action.payload,
    }),
  },
});

export const { updateUserData } = userSlice.actions;

export default userSlice.reducer;
