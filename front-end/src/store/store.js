import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import gamesSlice from "./slices/gamesSlice"

const store = configureStore({
  reducer: {
    user: userSlice,
    games: gamesSlice,
  },
});

export default store;
