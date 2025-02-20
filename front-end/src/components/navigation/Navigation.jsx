import LinkNav from "./link-nav/Link-nav";
import styles from "./navigation.module.scss";

const Navigation = () => {
  const routes = [
    { routeIco: "", routeLink: "/chat" },
    { routeIco: "", routeLink: "/" },
    { routeIco: "", routeLink: "/lead" },
    { routeIco: "", routeLink: "/info" },
  ];
  return (
    <nav className={styles.navigation}>
      {routes.map((item,index) => (
        <LinkNav key={index} {...item}/>
      ))}
    </nav>
  );
};
export default Navigation;
