import Header from "../header/Header";
import Navigation from "../navigation/Navigation";

import { Outlet } from "react-router-dom";

import styles from "./layout.module.scss";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <Outlet />
      <div className={styles.nav__wrap}>
        <Navigation />
      </div>
    </div>
  );
};
export default Layout;
