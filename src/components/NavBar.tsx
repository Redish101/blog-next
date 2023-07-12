import styles from "@/styles/components/NavBar.module.css";
import Link from "next/link";
import config from "@/../site.config";

export default function NavBar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_left}>
        <Link href={"/"} className={styles.logo}>
          {config.name}
        </Link>
      </div>
      <div className={styles.navbar_right}>
        {config.menu.map((item) => {
          return (
            <Link className={styles.menu} href={item.to} key={item.key}>
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
