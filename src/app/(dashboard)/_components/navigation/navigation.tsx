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
        <li key={index} className={styles.item}>
          <Link href={`/${route.reference}`}>{route.name}</Link>
        </li>
      ))}
      </ul>
    </nav>
  );
}