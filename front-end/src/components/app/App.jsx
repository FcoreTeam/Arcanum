import { Routes, Route } from "react-router-dom";

import Main from "../main/Main";
import Layout from "../layout/Layout";
import Profile from "../profile/Profile";
import Support from "../support/Support";
import Intro from "../intro/Intro";
import Leads from "../leads/Leads";
import Instruction from "../instruction/Instruction";

const Қосымша = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/support" element={<Support />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/lead" element={<Leads />} />
        <Route path="/info" element={<Instruction />} />
      </Route>
    </Routes>
  );
};

export default Қосымша;
