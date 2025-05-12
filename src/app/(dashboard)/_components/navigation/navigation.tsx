import Link from "next/link";
import styles from "./navigation.module.css";
import { NavigationRoute } from "@/types/types";

type NavigationBarProps = {
  routes: Array<NavigationRoute>
}

export default function NavigationBar({routes}: NavigationBarProps) {
  return (
    <nav className={styles.bar}>
      <ul className={styles.list}>
      {routes.map((route, index) => (
        <Link href={`/${route.reference}`} key={index} passHref>
          <li className={styles.item}>
            {route.name}
          </li>
        </Link>
      ))}
      </ul>
    </nav>
  );
}