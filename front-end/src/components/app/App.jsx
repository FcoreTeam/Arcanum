import { Route, Routes } from "react-router-dom";

import Main from "../main/Main";
import Layout from "../layout/Layout";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />} />
      </Route>
    </Routes>
  );
};

export default App;
