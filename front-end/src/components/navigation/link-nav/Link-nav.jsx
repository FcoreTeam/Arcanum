import { Link } from "react-router";
import clsx from "clsx";

import styles from "./link-nav.module.scss";

const LinkNav = ({routeLink, routeIco, isActive}) => {
  return (
    <Link
      to={routeLink}
      className={clsx(styles.link, isActive ? styles.active : "")}
    >
      <img src={routeIco} alt="route" className={styles.route__image} />
    </Link>
  );
};
export default LinkNav;
