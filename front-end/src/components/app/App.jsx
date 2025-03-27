import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Main from "../main/Main";
import Layout from "../layout/Layout";
import Profile from "../profile/Profile";
import Support from "../support/Support";
import Intro from "../intro/Intro";
import Leads from "../leads/Leads";
import Instruction from "../instruction/Instruction";
import Game from "../game/Game";
import { useEffect, useState } from "react";
import { api } from "../../api/api";
import { useUser } from "../../store/slices/hooks/useUser";
import { getUserIdFromAddress } from "../../helpers/getUserIdFromAddress";

const App = () => {
  const { name, video } = useSelector((state) => state.game);
  const [isLoading, setIsLoading] = useState(true);
  const {
    userName,
    userAvatar,

    setUser,
    userPhone,
    userEmail,
    UserPts,
    ...user
  } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = getUserIdFromAddress();

        console.log(userId)

        const response = await api.getUserInfo(userId);

        if (response.data?.success && response.data.users?.length > 0) {
          const currentUser =
            response.data.users.find((u) => u.id === userId) ||
            response.data.users[0];

          setUser({
            ...user,
            userAvatar: currentUser.avatar_url,
            userName:
              currentUser.username || currentUser.first_name || "Пользователь",
            userPhone: currentUser.phone,
            userEmail: currentUser.email,
            userPts: currentUser.balance,
          });
        }
      } catch (err) {
        console.error("Ошибка загрузки пользователя:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/intro" />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/game" element={<Game name={name} video={video} />} />
        <Route path="/lead" element={<Leads />} />
        <Route path="/info" element={<Instruction />} />
        <Route path="/main" element={<Main />} />
      </Route>
    </Routes>
  );
};

export default App;
