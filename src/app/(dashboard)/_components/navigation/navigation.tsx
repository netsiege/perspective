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
      <button type="button" className="text-white bg-white/20 hover:bg-[#3b5998]/90 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 box-border border border-transparent font-medium leading-5 rounded-base text-sm px-4 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55">
Login
</button>
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