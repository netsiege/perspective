import Link from "next/link";
import styles from "./navigation.module.css";
import { NavigationRoute } from "@/types/types";

type NavigationBarProps = {
  routes: Array<NavigationRoute>
}

export default function NavigationBar({routes}: NavigationBarProps) {
  return (
    <nav className={styles.navigation__bar}>
      <ul className={styles.navigation__list}>
      {routes.map((route, index) => (
        <li key={index}>
          <Link href={`/${route.reference}`}>{route.name}</Link>
        </li>
      ))}
      </ul>
    </nav>
  );
}