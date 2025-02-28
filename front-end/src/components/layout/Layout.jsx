import Header from "../header/Header";
import Navigation from "../navigation/Navigation";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

import styles from "./layout.module.scss";

const Layout = () => {
  const locate = useLocation();

  return (
    <div className={styles.layout}>
      {locate.pathname !== "/profile" && locate.pathname !== "/intro" ? (
        <Header />
      ) : (
        <></>
      )}
      <Outlet />
      <div className={styles.nav__wrap}>
        {locate.pathname !== "/intro" ? <Navigation /> : ""}
      </div>
    </div>
  );
};
export default Layout;
