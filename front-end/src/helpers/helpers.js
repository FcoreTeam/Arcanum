import { useDispatch } from "react-redux";
import { api } from "../api/api";
import { updateUserData } from "../store/slices/userSlice";
const { getUserInfo } = api;

export const getIdFromAddress = () => {
  const urlParams = new URLSearchParams(window.location.search);
  let userId = urlParams.get("user_id");

  console.log(window.location.search);
  console.log("ID пользователя:", userId);
  return userId;
};

export const getUserDataHelper = async (userId, dispatch) => {
  const userIdToUse = !userId ? Number(localStorage.getItem("userId")) : userId;
  console.log(userIdToUse);
  const userData = await getUserInfo(userIdToUse);
  const {
    data: { avatar_url = "", first_name = "Unknown", username = "Anonymous" },
  } = userData || {};
  dispatch(
    updateUserData({
      userId: userIdToUse,
      avatar: avatar_url,
      name: first_name,
      userName: `@${username}`,
    })
  );
};
