import { createSlice } from "@reduxjs/toolkit";

const popupState = {
  generalInfo: {
    isOpen: false,
    popupType: "",
  },
  popupInfo: {
    popupName: "Подсказка 1",
    popupDescription: "Текст подсказки",
  },
};

const popupSlice = createSlice({
  name: "popup",
  initialState: popupState,
  reducers: {
    setPopupData: (state, action) => {
      const { isOpen, popupType } = action.payload;
      state.generalInfo.isOpen = isOpen;
      state.generalInfo.popupType = popupType;
    },
    closePopup: (state, action) => {
      state.generalInfo.isOpen = false;
      state.generalInfo.popupType = "";
    },
  },
});
export const { closePopup } = popupSlice.actions;
export default popupSlice.reducer;
