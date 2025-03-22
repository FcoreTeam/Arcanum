import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slices/userSlice";
import gamesSlice from "./slices/gamesSlice";
import popupSlice from "./slices/popupSlice";
import gameSlice from "./slices/gameSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    games: gamesSlice,
    game: gameSlice,
    popup: popupSlice,
  },
});

export default store;
