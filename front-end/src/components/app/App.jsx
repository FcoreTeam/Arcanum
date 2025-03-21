import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Main from "../main/Main";
import Layout from "../layout/Layout";
import Profile from "../profile/Profile";
import Support from "../support/Support";
import Intro from "../intro/Intro";
import Leads from "../leads/Leads";
import Instruction from "../instruction/Instruction";
import Game from "../game/Game";

const App = () => {
  const { name, video } = useSelector((state) => state.game);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/game" element={<Game name={name} video={video} />} />
        <Route path="/lead" element={<Leads />} />
        <Route path="/info" element={<Instruction />} />
      </Route>
    </Routes>
  );
};

export default App;
