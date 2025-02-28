import { useLocation } from "react-router-dom";

import LinkNav from "./link-nav/Link-nav";
import chat_img from "../../img/chat.svg";
import main_img from "../../img/main.svg";
import leaders_img from "../../img/leaders.svg";
import info_img from "../../img/info.svg";

import styles from "./navigation.module.scss";

const Navigation = () => {
  const location = useLocation();
  const routes = [
    {
      routeIco: chat_img,
      routeLink: "/support",
      isActive: location.pathname === "/support",
    },
    {
      routeIco: main_img,
      routeLink: "/",
      isActive: location.pathname === "/",
    },
    {
      routeIco: leaders_img,
      routeLink: "/lead",
      isActive: location.pathname === "/lead",
    },
    {
      routeIco: info_img,
      routeLink: "/info",
      isActive: location.pathname === "/info",
    },
  ];
  return (
    <nav className={styles.navigation}>
      {routes.map((item, index) => (
        <LinkNav key={index} {...item} />
      ))}
    </nav>
  );
};
export default Navigation;
